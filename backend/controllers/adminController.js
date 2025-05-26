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

const getUsers = async (req, res) => {
  const logHeader = "getUsers";
  logger.info(`${logHeader}`, req.query);

  const { role_id } = req.query;

  try {
    logger.info(`${logHeader}: trying to get users data`);
    const [rows] = await pool.query(`SELECT * FROM user WHERE role_id != 1`);

    return res.status(200).json({
      status: "success",
      message: "Get users successful",
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

const verifySeller = async (req, res) => {
  const logHeader = "apiVerify";
  logger.info(`${logHeader}`, req.body);

  try {
    logger.info(`${logHeader}: trying to verify seller`);
    const { id: seller_id } = req.body;

    const [result] = await pool.query(
      `SELECT id FROM user WHERE id = ? and role_id = 2`,
      [seller_id]
    );
    if (result.length === 0) {
      logger.info(`${logHeader}: seller is not found`);
      return res.status(404).json({
        status: "failed",
        message: "Seller is not found",
      });
    }

    await pool.query(
      `UPDATE user SET verified = true WHERE id = ? and role_id = 2`,
      [seller_id]
    );

    return res.status(200).json({
      status: "success",
      message: "Seller verified",
    });
  } catch (err) {
    logger.error(`${logHeader}: ${err}`);
    return res.status(500).json({
      status: "failed",
      message: "Server error",
    });
  }
};

const rejectSeller = async (req, res) => {
  const logHeader = "apiReject";
  logger.info(`${logHeader}`, req.body);

  const { id: seller_id } = req.body;

  try {
    logger.info(`${logHeader}: trying to reject`);
    await pool.query(`DELETE FROM user WHERE id = ?`, [seller_id]);

    return res.status(200).json({
      status: "success",
      message: "User rejected",
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
  getUsers,
  verifySeller,
	rejectSeller
};
