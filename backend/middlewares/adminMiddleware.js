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

async function validateAdmin(req, res, next) {
  const [adminCheck] = await pool.query(
    `SELECT * FROM user WHERE id = ${req.user.id} and role_id = 1`
  );
  if (adminCheck.length === 0) {
    return res.status(401).json({
      status: "failed",
      message: "Unauthorized",
    });
  }

  next();
}

module.exports = {
    validateAdmin
}