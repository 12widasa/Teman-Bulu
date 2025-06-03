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

const getProfile = async (req, res) => {
  const logHeader = 'apiGetProfile';
  logger.info(`${logHeader}`);

  try {
    logger.info(`${logHeader}: trying to get seller profile`);
    
    const [result] = await pool.query(
      `SELECT * FROM user WHERE id = ${req.user.id}`
    )

    return res.status(200).json({
      status: "success",
      message: 'Get profile successful',
      data: result
    })
  } catch (err) {
    logger.error(`${logHeader}: ${err}`);
    return res.status(500).json({
      status: 'failed',
      message: 'Server error'
    })
  }
}

const updateProfileSeller = async (req, res) => {
  const logHeader = "apiUpdateProfileSeller";
  logger.info(`${logHeader}`, req.body);

  const {
    full_name,
    email,
    password,
    animal_ids,
    birth,
    phone_number,
    address,
    description,
    profile,
    cv,
    certificate,
  } = req.body;

  try {
    logger.info(`${logHeader}: trying to update profile seller`);
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `UPDATE user SET
          full_name = '${full_name}',
          email = '${email}',
          password = '${hashedPassword}',
          birth = '${birth}',
          phone_number = '${phone_number}',
          address = '${address}',
          description = '${description}',
          profile = '${profile}',
          cv = '${cv}',
          certificate = '${certificate}'
          WHERE id = ${req.user.id}
        `
    );

    const deleteAnimals = await pool.query(
      `DELETE FROM user_animals WHERE user_id = ${req.user.id};`
    );

    const userAnimalsValues = animal_ids
      .map((animal_id) => `(${req.user.id}, ${animal_id})`)
      .join(",");
    
    if (userAnimalsValues.length > 0) {
      const [insertSellerAnimals] = await pool.query(
        `INSERT INTO user_animals (user_id, animal_id) VALUES ${userAnimalsValues};`
      );
    }

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

const addService = async (req, res) => {
  const logHeader = "apiService";
  logger.info(`${logHeader}`, req.body);

  const { skill_id, animal_id, price } = req.body;

  try {
    logger.info(`${logHeader}: trying to insert service`);
    await pool.query(
      `INSERT INTO service (skill_id, animal_id, seller_id, price) VALUES (?, ?, ?, ?)`,
      [skill_id, animal_id, req.user.id, price]
    );

    return res.status(201).json({
      status: "success",
      message: "Service inserted",
    });
  } catch (err) {
    logger.error(`${logHeader}: ${err}`);
    return res.status(500).json({
      status: "failed",
      message: "Server error",
    });
  }
};

const updateStatus = async (req, res) => {
  const logHeader = "apiUpdateStatus";
  logger.info(`${logHeader}`, req.body);

  const { order_id } = req.body;

  try {
    logger.info(`${logHeader}: trying to update order status`);
    await pool.query(
      `UPDATE \`order\` SET status = 2 WHERE id = ? AND status = 1`,
      [order_id]
    );

    return res.status(201).json({
      status: "success",
      message: "Order status updated",
    });
  } catch (err) {
    logger.error(`${logHeader}: ${err}`);
    return res.status(201).json({
      status: "failed",
      message: "Server error",
    });
  }
};

const getServices = async (req, res) => {
  const logHeader = "apiServices";
  logger.info(`${logHeader}`, req.user.id);

  try {
    logger.info(`${logHeader}: trying to get services`);
    const [rows] = await pool.query(
      `SELECT * FROM service WHERE seller_id = ?`,
      [req.user.id]
    );

    return res.status(200).json({
      status: "success",
      message: "Get services successful",
      data: rows,
    });
  } catch (err) {
    logger.error(`${logHeader}: ${err}`);
    return res.status(500).json({
      status: "failed",
      message: "Server error",
    });
  }
};

const getSellerOrders = async (req, res) => {
  const logHeader = "apiSellerOrders";
  logger.info(`${logHeader}`, req.user.id);

  try {
    logger.info(`${logHeader}: trying to get seller orders`);
    const [rows] = await pool.query(
      `
            SELECT
                \`order\`.id,
                \`order\`.start_dt,
                \`order\`.end_dt,
                \`order\`.address,
                \`order\`.status,
                \`order\`.total_price,
                animal.name AS animal_name,
                user.full_name AS buyer_full_name,
                user.phone_number AS buyer_phone_number,
                skill.name AS skill_name
            FROM
                \`order\` INNER JOIN service ON \`order\`.service_id = service.id INNER JOIN skill ON service.skill_id = skill.id INNER JOIN animal ON service.animal_id = animal.id INNER JOIN user ON \`order\`.buyer_id = user.id WHERE service.seller_id = ?
        `,
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

const changeStatus = async (req, res) => {
  const logHeader = "apiChangeStatus";
  logger.info(`${logHeader}`, req.user.id);

  let { status } = req.body;

  try {
    logger.info(`${logHeader}: trying to change status`);
    if (status === 0) {
      status = false;
    } else {
      status === true
    }

    await pool.query(
      `UPDATE user SET status = ? WHERE id = ? AND role_id = 2`,
      [status, req.user.id]
    );

    return res.status(200).json({
      status: "success",
      message: `Seller ${status ? "online" : "offline"}`,
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
  updateProfileSeller,
  addService,
  updateStatus,
  getServices,
  getSellerOrders,
  changeStatus,
  getProfile
};
