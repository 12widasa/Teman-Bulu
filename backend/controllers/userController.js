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
const jwt = require("jsonwebtoken");

const registerSeller = async (req, res) => {
  const logHeader = "apiRegister";
  logger.info(`${logHeader}`, req.body);

  try {
    logger.debug(`${logHeader}: trying to register user`);
    const [userCheck] = await pool.query(
      `SELECT id FROM user WHERE email = ? OR username = ? OR phone_number = ?`,
      [req.body.email, req.body.username, req.body.phone_number]
    );

    if (userCheck.length > 0) {
      logger.debug(
        `${logHeader}: email or username or phone number already exist`
      );
      return res.status(400).json({
        status: "failed",
        message: "Email or username or phone number already exist",
      });
    }

    const [checkAnimal] = await pool.query(
      `SELECT id FROM animal WHERE id IN (?)`,
      [req.body.animal_ids]
    );
    if (checkAnimal.length !== req.body.animal_ids.length) {
      logger.debug(`${logHeader}: animals are not available`);
      return res.status(400).json({
        status: "failed",
        message: "Animals are not available",
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    await pool.query("BEGIN");
    const [result] = await pool.query(
      `INSERT INTO user (
        full_name,
        username,
        email,
        password,
        birth,
        phone_number,
        address,
        profile,
        cv,
        certificate,
        role_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.body.full_name,
        req.body.username,
        req.body.email,
        hashedPassword,
        req.body.birth,
        req.body.phone_number,
        req.body.address,
        req.body.profile || null,
        req.body.cv || null,
        req.body.certificate || null,
        2,
      ]
    );

    const userId = result.insertId;

    const userAnimalsValues = req.body.animal_ids
      .map((animal_id) => `(${userId}, ${animal_id})`)
      .join(",");
    const [insertSellerAnimals] = await pool.query(
      `INSERT INTO user_animals (user_id, animal_id) VALUES ${userAnimalsValues};`
    );

    const skillIds = [1, 2, 3, 4];
    let insertServices = "";

    let skillIdCounter = 0;
    let animalIdCounter = 0;
    skillIds.forEach((skillId) => {
      skillIdCounter++;
      req.body.animal_ids.map((animalId) => {
        animalIdCounter++;
        let price = 0;
        if (skillId === 1) {
          if (animalId === 1) {
            price = 90000;
          } else if (animalId === 2) {
            price = 80000;
          } else if (animalId === 3) {
            price = 65000;
          } else if (animalId === 4) {
            price = 130000;
          }
        } else if (skillId === 2) {
          if (animalId === 1) {
            price = 120000;
          } else if (animalId === 2) {
            price = 100000;
          } else if (animalId === 3) {
            price = 80000;
          } else if (animalId === 4) {
            price = 160000;
          }
        } else if (skillId === 3) {
          if (animalId === 1) {
            price = 65000;
          } else if (animalId === 2) {
            price = 70000;
          } else if (animalId === 3) {
            price = 45000;
          } else if (animalId === 4) {
            price = 100000;
          }
        } else if (skillId === 4) {
          if (animalId === 1) {
            price = 55000;
          } else if (animalId === 2) {
            price = 60000;
          } else if (animalId === 3) {
            price = 40000;
          } else if (animalId === 4) {
            price = 90000;
          }
        }

        if (
          skillIdCounter === skillIds.length &&
          animalIdCounter === skillIds.length * req.body.animal_ids.length
        ) {
          insertServices += `(${skillId}, ${animalId}, ${userId}, ${price});`;
        } else {
          insertServices += `(${skillId}, ${animalId}, ${userId}, ${price}),`;
        }
      });
    });

    const [insertSellerServices] = await pool.query(
      `INSERT INTO service (skill_id, animal_id, seller_id, price) VALUES ${insertServices};`
    );

    await pool.query("COMMIT");

    return res.status(201).json({
      status: "success",
      message: "User registered",
    });
  } catch (err) {
    logger.error(`${logHeader}: ${err}`);
    await pool.query("ROLLBACK");
    return res.status(500).json({
      status: "failed",
      message: "Server error",
    });
  }
};

const registerAdmin = async (req, res) => {
  const logHeader = "apiRegisterAdmin";
  logger.info(`${logHeader}`, req.body);

  const { full_name, email, password } = req.body;

  try {
    logger.info(`${logHeader}: trying to register admin`);
    const [adminCheck] = await pool.query(
      `SELECT id FROM user WHERE email = ? AND role_id = 1`,
      [email]
    );

    if (adminCheck.length > 0) {
      logger.info(`${logHeader}: email already exist`);
      return res.status(400).json({
        status: "failed",
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO `user` (full_name, email, password, role_id) VALUES (?, ?, ?, 1)",
      [full_name, email, hashedPassword]
    );

    return res.status(201).json({
      status: "success",
      message: "Admin registered",
    });
  } catch (err) {
    logger.error(`${logHeader}: ${err}`);
    return res.status(500).json({
      status: "failed",
      message: "Server error",
    });
  }
};

const registerBuyer = async (req, res) => {
  const logHeader = "apiRegisterBuyer";
  logger.info(`${logHeader}`, req.body);

  const { full_name, email, password } = req.body;

  try {
    logger.info(`${logHeader}: trying to register buyer`);
    const [buyerCheck] = await pool.query(
      "SELECT id FROM user WHERE email = ? AND role_id = 3",
      [email]
    );

    if (buyerCheck.length > 0) {
      logger.info(`${logHeader}: email already exist`);
      return res.status(400).json({
        status: "failed",
        message: "Email already exist",
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const result = await pool.query(
      "INSERT INTO user (full_name, email, password, role_id) VALUES (?, ?, ?, 3)",
      [full_name, email, hashedPassword]
    );

    return res.status(201).json({
      status: "success",
      message: "Buyer registered",
    });
  } catch (err) {
    logger.error(`${logHeader}: ${err}`);
    return res.status(500).json({
      status: "failed",
      message: "Server error",
    });
  }
};

const login = async (req, res) => {
  const logHeader = "apiLogin";
  logger.info(`${logHeader}`, req.body);

  const { email, password } = req.body;

  try {
    const [result] = await pool.query(`SELECT * FROM user WHERE email = ?`, [
      email,
    ]);

    if (result.length === 0) {
      logger.info(`${logHeader}: invalid email or password`);
      return res.status(401).json({
        status: "failed",
        message: "Invalid email or password",
      });
    }

    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.info(`${logHeader}: invalid email or password`);
      return res.status(401).json({
        status: "failed",
        message: "Invalid email or password",
      });
    }

    if (user.role_id === 2) {
      // seller
      if (!user.verified) {
        logger.info(`${logHeader}: user is not verified by admin`);
        return res.status(401).json({
          status: "failed",
          message: "Seller has not verified by admin yet",
        });
      }
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
        role_id: user.role_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRES_IN }
    );

    return res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        token: token,
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

const getAnimals = async (req, res) => {
  const logHeader = "apiAnimals";
  logger.info(`${logHeader}`);

  try {
    logger.info(`${logHeader}: trying to get animals`);
    const [rows] = await pool.query(`SELECT * FROM animal`);

    return res.status(200).json({
      status: "success",
      message: "Get animals successful",
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

module.exports = {
  registerSeller,
  registerAdmin,
  registerBuyer,
  login,
  getAnimals
};
