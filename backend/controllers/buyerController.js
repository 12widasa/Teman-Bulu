const winston = require("winston");
const { combine, timestamp, json, printf } = winston.format;
const timestampFormat = "YYYY-MM-DD HH:mm:ss";
const logger = winston.createLogger({
  format: combine(
    timestamp({ format: timestampFormat }),
    json(),
    printf(({ timestamp, level, message, ...data }) => {
      const response = {
        level,
        timestamp,
        message,
      };

      if (Object.keys(data).length > 0) {
        response.data = data;
      }
      return JSON.stringify(response);
    })
  ),
  transports: [new winston.transports.Console()],
});

const mysql = require("mysql2/promise");
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
const bcrypt = require("bcryptjs");

const updateProfileBuyer = async (req, res) => {
  const logHeader = "apiUpdateProfileBuyer";
  logger.info(`${logHeader}`, req.body);

  const { full_name, email, password, phone_number, address } = req.body;

  try {
    logger.info(`${logHeader}: trying to update profile buyer`);
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `UPDATE user SET
        full_name = '${full_name}',
        email = '${email}',
        password = '${hashedPassword}',
        phone_number = '${phone_number}',
        address = '${address}'
        WHERE id = ${req.user.id}
      `
    );

    return res.status(201).json({
      status: "success",
      message: "Profile updated",
    });
  } catch (err) {
    logger.error(`${logHeader}: ${err}`);
    return res.status(500).json({
      status: "failed",
      message: "Server error",
    });
  }
};

const getSellerServices = async (req, res) => {
  const logHeader = "apiSellerServices";
  logger.info(`${logHeader}`, req.query);

  const { animal_ids, rating } = req.query;

  try {
    logger.info(`${logHeader}: trying to get seller services`);

    const queryParams = [];
    let whereClause = `WHERE user.role_id = 2 AND user.status = true`;

    if (animal_ids) {
      whereClause += ` AND service.animal_id IN (?)`;
      queryParams.push(animal_ids);
    }

    let havingClause = "";
    if (rating) {
      havingClause = `HAVING average_rating >= ?`;
      queryParams.push(parseFloat(rating));
    }

    const [sellerServices] = await pool.query(
      `
        SELECT
          user.id,
          user.full_name,
          user.profile,
          user.description,
          ROUND(AVG(\`order\`.rating), 2) AS average_rating
        FROM user 
        INNER JOIN service ON user.id = service.seller_id 
        LEFT JOIN \`order\` ON service.id = \`order\`.service_id 
        ${whereClause}
        GROUP BY user.full_name
        ${havingClause}
      `,
      queryParams
    );

    return res.status(200).json({
      status: "success",
      message: "Get seller services successful",
      data: sellerServices,
    });
  } catch (err) {
    logger.error(`${logHeader}: ${err}`);
    return res.status(500).json({
      status: "failed",
      message: "Server error",
    });
  }
};

const getSeller = async (req, res) => {
  const logHeader = "apiSeller";
  logger.info(`${logHeader}`, req.params);

  const { id } = req.params;

  try {
    logger.info(`${logHeader}: trying to get seller`);

    // 1. Get seller info with average rating
    const [sellerResult] = await pool.query(
      `
        SELECT
          user.id,
          user.full_name,
          user.description,
          user.profile,
          ROUND(AVG(\`order\`.rating), 2) AS average_rating
        FROM user 
        LEFT JOIN service ON user.id = service.seller_id 
        LEFT JOIN \`order\` ON service.id = \`order\`.service_id 
        WHERE user.id = ? AND user.role_id = 2
        GROUP BY user.id
      `,
      [id]
    );

    if (sellerResult.length === 0) {
      return res.status(404).json({
        status: "failed",
        message: "Seller not found",
      });
    }

    const seller = sellerResult[0];

    // 2. Get services by the seller
    const [services] = await pool.query(
      `
        SELECT service.id, service.price, skill.name AS skill_name, animal.name AS animal_name, skill.status AS skill_status, skill.description AS skill_description
        FROM service
        LEFT JOIN skill ON service.skill_id = skill.id
        LEFT JOIN animal ON service.animal_id = animal.id
        WHERE service.seller_id = ?
      `,
      [id]
    );

    services.forEach((service) => {
      service.skill_description = JSON.parse(service.skill_description);
    });

    // 3. Get animals linked to the seller via user_animals
    const [animals] = await pool.query(
      `
        SELECT animal.id, animal.name
        FROM user_animals
        INNER JOIN animal ON user_animals.animal_id = animal.id
        WHERE user_animals.user_id = ?
      `,
      [id]
    );

    const [buyer] = await pool.query(
      `
        SELECT address FROM user WHERE id = ?
      `,
      [req.user.id]
    );

    return res.status(200).json({
      status: "success",
      message: "Get seller successful",
      data: {
        seller,
        services,
        animals,
        buyer,
      },
    });
  } catch (err) {
    logger.error(`${logHeader}: ${err}`);
    return res.status(500).json({
      status: "failed",
      message: "Server error",
    });
  }
};

const order = async (req, res) => {
  const logHeader = "apiOrder";
  logger.info(`${logHeader}`, req.body);

  const { service_id, start_dt, end_dt, address, total_price } = req.body;

  try {
    logger.info(`${logHeader}: trying to order`);

    // Check if service exists
    const [serviceResult] = await pool.query(
      "SELECT * FROM service INNER JOIN skill ON service.skill_id = skill.id WHERE service.id = ?",
      [service_id]
    );

    if (serviceResult.length === 0) {
      return res.status(404).json({
        status: "failed",
        message: "Service not found",
      });
    }

    if (serviceResult[0].status === 0) {
      // 0: di rumah
      logger.info(`${logHeader}: service on home, need buyer address`);
      if (!address) {
        logger.info(`${logHeader}: buyer address is not found`);
        return res.status(404).json({
          status: "failed",
          message: "Buyer address is not found",
        });
      }
    } else if (serviceResult[0].status === 1) {
      // 1: penitipan
      logger.info(`${logHeader}: service on seller store, need end_dt`);
      if (!end_dt) {
        logger.info(`${logHeader}: end_dt is not found`);
        return res.status(404).json({
          status: "failed",
          message: "End date is not found",
        });
      }
    } else {
      logger.info(`${logHeader}: service status is not valid`);
      return res.status(500).json({
        status: "failed",
        message: "Status is not valid",
      });
    }

    const [orderResult] = await pool.query(
      `
        INSERT INTO \`order\` (
          service_id,
          buyer_id,
          status,
          start_dt,
          end_dt,
          address,
          total_price
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [service_id, req.user.id, 0, start_dt, end_dt, address, total_price]
    );

    return res.status(201).json({
      status: "success",
      message: "Order succesful",
      data: orderResult,
    });
  } catch (err) {
    logger.error(`${logHeader}: ${err}`);
    return res.status(500).json({
      status: "failed",
      message: "Server error",
    });
  }
};

const payOrder = async (req, res) => {
  const logHeader = "apiPayOrder";
  logger.info(`${logHeader}`, req.body);

  const { order_id } = req.body;

  try {
    logger.info(`${logHeader}: trying to pay order`);
    const [orderCheck] = await pool.query(
      `SELECT status AS status FROM \`order\` WHERE id = ?`,
      [order_id]
    );
    if (orderCheck[0].status === 1 || orderCheck[0].status === 2) {
      logger.info(`${logHeader}: order has already paid`);
      return res.status(403).json({
        status: "failed",
        message: "Order has already paid",
      });
    }

    const [result] = await pool.query(
      `UPDATE \`order\` SET status = 1 WHERE id = ?`,
      [order_id]
    );

    return res.status(201).json({
      status: "success",
      message: "Order paid",
    });
  } catch (err) {
    logger.error(`${logHeader}: ${err}`);
    return res.status(500).json({
      status: "failed",
      message: "Server error",
    });
  }
};

const buyerOrders = async (req, res) => {
  const logHeader = "apiOrders";
  logger.info(`${logHeader}`, req.user.id);

  try {
    logger.info(`${logHeader}: trying to get orders`);
    const [rows] = await pool.query(
      `SELECT 
        \`order\`.id AS order_id,
        service.id AS service_id,
        \`order\`.status AS status,
        \`order\`.rating AS rating,
        \`order\`.start_dt AS start_dt,
        \`order\`.end_dt AS end_dt,
        \`order\`.address AS address,
        \`order\`.total_price AS total_price,
        user.full_name AS seller_name,
        user.phone_number AS seller_phone_number,
        skill.name AS skill_name,
        service.skill_id AS skill_id,
        service.animal_id AS animal_id,
        service.seller_id AS seller_id,
        animal.name AS animal_name
      FROM \`order\` INNER JOIN service ON \`order\`.service_id = service.id INNER JOIN user ON service.seller_id = user.id INNER JOIN skill ON service.skill_id = skill.id INNER JOIN animal ON service.animal_id = animal.id WHERE \`order\`.buyer_id = ?`,
      [req.user.id]
    );

    let willTakePlaceCount = 0;
    let takingPlaceCount = 0;
    let finishedCount = 0;

    rows.forEach((row) => {
      if (row.status === 0) willTakePlaceCount += 1;
      else if (row.status === 1) takingPlaceCount += 1;
      else if (row.status === 2) finishedCount += 1;
    });

    return res.status(200).json({
      status: "success",
      message: "Get orders successful",
      data: {
        akan_berlangsung: willTakePlaceCount,
        berlangsung: takingPlaceCount,
        selesai: finishedCount,
        orders: rows,
      },
    });
  } catch (err) {
    logger.error(`${logHeader}: ${err}`);
    return res.status(500).json({
      status: "failed",
      message: "Server error",
    });
  }
};

const rateOrder = async (req, res) => {
  const logHeader = "apiRateOrder";
  logger.info(`${logHeader}`, req.body);

  const { order_id, rating } = req.body;

  try {
    logger.info(`${logHeader}: trying to rate order`);

    const [orderCheck] = await pool.query(
      `SELECT buyer_id AS buyer_id, status AS status, rating FROM \`order\` WHERE id = ?`,
      [order_id]
    );
    if (orderCheck[0].buyer_id !== req.user.id) {
      logger.info(
        `${logHeader}: this order is not belongs to this user ${req.user.id}`
      );
      return res.status(403).json({
        status: "failed",
        message: "This order is not belongs to this user",
      });
    }

    // order status 0: belum bayar, 1: sedang berlangsung
    if (orderCheck[0].status === 0 || orderCheck[0].status === 1) {
      logger.info(
        `${logHeader}: order status ${orderCheck[0].status} is not allowed`
      );
      return res.status(403).json({
        status: "failed",
        message: "Order status is not allowed",
      });
    }

    if (orderCheck[0].rating) {
      logger.info(`${logHeader}: order has already rated`);
      return res.status(403).json({
        status: "failed",
        message: "Order has already rated",
      });
    }

    const [result] = await pool.query(
      `UPDATE \`order\` SET rating = ? WHERE id = ?`,
      [rating, order_id]
    );

    return res.status(201).json({
      status: "success",
      message: "Rate order successful",
    });
  } catch (err) {
    logger.error(`${logHeader}: ${err}`);
    return res.status(500).json({
      status: "failed",
      message: "Server error",
    });
  }
};

module.exports = {
  updateProfileBuyer,
  getSellerServices,
  getSeller,
  order,
  payOrder,
  buyerOrders,
  rateOrder
};
