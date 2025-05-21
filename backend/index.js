const express = require("express");
const app = express();
const port = 3000;

const cors = require("cors");
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
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const upload = multer({
  dest: "./upload/",
});

const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test Koneksi
(async () => {
  try {
    const [rows] = await pool.query("SELECT NOW()");
    console.log("Database connected at:", rows[0]["NOW()"]);
  } catch (err) {
    console.error("Database connection error:", err);
  }
})();

app.use(cors());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get("/", (req, res) => {
  return res.status(200).json({
    'status': 'success',
    'message': 'APIs are ready'
  })
});

app.post("/api/registerSeller", validateBody(['full_name', 'username', 'email', 'password', 'animal_ids', 'birth', 'phone_number', 'address']), async (req, res) => {
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
      `SELECT id FROM animal WHERE id IN (?)`, [req.body.animal_ids]
    );
    if (checkAnimal.length !== req.body.animal_ids.length) {
      logger.debug(`${logHeader}: animals are not available`);
      return res.status(400).json({
        status: "failed",
        message: "Animals are not available",
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    await pool.query('BEGIN');
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

    const userAnimalsValues = req.body.animal_ids.map(animal_id => `(${userId}, ${animal_id})`).join(',');
    const [insertSellerAnimals] = await pool.query(
      `INSERT INTO user_animals (user_id, animal_id) VALUES ${userAnimalsValues};`
    )

    await pool.query('COMMIT');

    return res.status(201).json({
      status: "success",
      message: "User registered"
    });
  } catch (err) {
    logger.error(`${logHeader}: ${err}`);
    await pool.query('ROLLBACK');
    return res.status(500).json({
      status: "failed",
      message: "Server error",
    });
  }
});

app.post('/api/updateProfileSeller', verifyToken, validateSeller, validateBody(['full_name', 'email', 'password', 'animal_id', 'birth', 'phone_number', 'address', 'description', 'profile', 'cv', 'certificate']), async (req, res) => {
  const logHeader = 'apiUpdateProfileSeller';
  logger.info(`${logHeader}`, req.body);

  const { full_name, email, password, animal_id, birth, phone_number, address, description, profile, cv, certificate } = req.body;

  try {
    logger.info(`${logHeader}: trying to update profile seller`);
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `UPDATE "user" SET
        full_name = '${full_name}',
        email = '${email}',
        password = '${hashedPassword}',
        animal_id = '${animal_id}',
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

    return res.status(201).json({
      'status': 'success',
      'message': 'Profile updated'
    })
  } catch (err) {
    logger.error(`${logHeader}: ${err}`);
    return res.status(500).json({
      'status': 'failed',
      'message': 'Server error'
    })
  }
})

app.post('/api/registerAdmin', validateBody(['full_name', 'email', 'password']), async (req, res) => {
  const logHeader = 'apiRegisterAdmin';
  logger.info(`${logHeader}`, req.body);

  const { full_name, email, password } = req.body;

  try {
    logger.info(`${logHeader}: trying to register admin`);
    const [adminCheck] = await pool.query(
      `SELECT id FROM user WHERE email = ? AND role_id = 1`, [email]
    );

    if (adminCheck.length > 0) {
      logger.info(`${logHeader}: email already exist`);
      return res.status(400).json({
        'status': 'failed',
        'message': 'Email already registered'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO `user` (full_name, email, password, role_id) VALUES (?, ?, ?, 1)', [full_name, email, hashedPassword]
    );

    return res.status(201).json({
      'status': 'success',
      'message': 'Admin registered'
    })
  } catch (err) {
    logger.error(`${logHeader}: ${err}`);
    return res.status(500).json({
      'status': 'failed',
      'message': 'Server error'
    })
  }
})

app.post('/api/registerBuyer', validateBody(['full_name', 'email', 'password']), async (req, res) => {
  const logHeader = 'apiRegisterBuyer';
  logger.info(`${logHeader}`, req.body);

  const { full_name, email, password } = req.body;

  try {
    logger.info(`${logHeader}: trying to register buyer`);
    const [buyerCheck] = await pool.query(
      'SELECT id FROM user WHERE email = ? AND role_id = 3', [email]
    );

    if (buyerCheck.length > 0) {
      logger.info(`${logHeader}: email already exist`);
      return res.status(400).json({
        'status': 'failed',
        'message': 'Email already exist'
      })
    };

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const result = await pool.query(
      'INSERT INTO user (full_name, email, password, role_id) VALUES (?, ?, ?, 3)', [full_name, email, hashedPassword] 
    );

    return res.status(201).json({
      'status': 'success',
      'message': 'Buyer registered'
    })
  } catch (err) {
    logger.error(`${logHeader}: ${err}`);
    return res.status(500).json({
      status: "failed",
      message: "Server error",
    });
  }
})

app.post('/api/updateProfileBuyer', verifyToken, validateBuyer, validateBody(['full_name', 'email', 'password', 'phone_number', 'address']), async (req, res) => {
  const logHeader = 'apiUpdateProfileBuyer';
  logger.info(`${logHeader}`, req.body);

  const { full_name, email, password, phone_number, address } = req.body;

  try {
    logger.info(`${logHeader}: trying to update profile buyer`);
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `UPDATE "user" SET
        full_name = '${full_name}',
        email = '${email}',
        password = '${hashedPassword}',
        phone_number = '${phone_number}',
        address = '${address}'
        WHERE id = ${req.user.id}
      `
    );

    return res.status(201).json({
      'status': 'success',
      'message': 'Profile updated'
    })
  } catch (err) {
    logger.error(`${logHeader}: ${err}`);
    return res.status(500).json({
      'status': 'failed',
      'message': 'Server error'
    })
  }
})

app.post("/api/login", validateLoginBody, async (req, res) => {
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
});

app.post(
  "/api/verify",
  verifyToken,
  validateAdmin,
  validateRequiredIdBody,
  async (req, res) => {
    const logHeader = "apiVerify";
    logger.info(`${logHeader}`, req.body);

    if (req.user.role_id !== 1) {
      logger.info(`${logHeader}: user is not admin`);
      return res.status(401).json({
        status: "failed",
        message: "Unauthorized",
      });
    }

    try {
      logger.info(`${logHeader}: trying to verify seller`);
      const { id } = req.body;

      const [result] = await pool.query(
        `SELECT id FROM user WHERE id = ? and role_id = 2`,
        [id]
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
        [id]
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
  }
);

app.post(
  "/api/reject",
  verifyToken,
  validateAdmin,
  validateRequiredIdBody,
  async (req, res) => {
    const logHeader = "apiReject";
    logger.info(`${logHeader}`, req.body);

    const { id } = req.body;

    try {
      logger.info(`${logHeader}: trying to reject`);
      await pool.query(`DELETE FROM user WHERE id = ?`, [id]);

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
  }
);

app.post(
  "/api/changeStatus",
  verifyRequiredChangeStatusBody,
  verifyToken,
  async (req, res) => {
    const logHeader = "apiChangeStatus";
    logger.info(`${logHeader}`, req.user.id);

    const { status } = req.body;

    try {
      logger.info(`${logHeader}: trying to change status`);
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
  }
);

app.get("/api/animals", async (req, res) => {
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
});

app.post("/api/skill", validateRequiredNameBody, async (req, res) => {
  const logHeader = "apiSkill";
  logger.info(`${logHeader}`, req.body);

  try {
    logger.info(`${logHeader}: trying to insert skill`);
    const [skillCheck] = await pool.query(
      `SELECT id FROM skill WHERE name = ?`,
      [req.body.name]
    );
    if (skillCheck.length > 0) {
      logger.info(`${logHeader}: skill '${req.body.name}' already exist`);
      return res.status(400).json({
        status: "failed",
        message: `Skill ${req.body.name} already exist`,
      });
    }

    await pool.query(`INSERT INTO skill (name) VALUES (?)`, [req.body.name]);

    logger.info(`${logHeader}: skill inserted`);
    return res.status(201).json({
      status: "success",
      message: "Skill inserted",
    });
  } catch (err) {
    logger.error(`${logHeader}: ${err}`);
    return res.status(400).json({
      status: "failed",
      message: "Server error",
    });
  }
});

app.post("/api/animal", validateRequiredNameBody, async (req, res) => {
  const logHeader = "apiAnimal";
  logger.info(`${logHeader}`, req.body);

  try {
    logger.info(`${logHeader}: trying to insert animal`);
    const [animalCheck] = await pool.query(
      `SELECT id FROM animal WHERE name = ?`,
      [req.body.name]
    );
    if (animalCheck.length > 0) {
      logger.info(`${logHeader}: animal '${req.body.name}' already exist`);
      return res.status(400).json({
        status: "failed",
        message: `Animal ${req.body.name} already exist`,
      });
    }

    await pool.query(`INSERT INTO animal (name) VALUES (?)`, [req.body.name]);

    logger.info(`${logHeader}: animal inserted`);
    return res.status(201).json({
      status: "success",
      message: "Animal inserted",
    });
  } catch (err) {
    logger.error(`${logHeader}: ${err}`);
    return res.status(400).json({
      status: "failed",
      message: "Server error",
    });
  }
});

app.post("/api/role", validateRequiredNameBody, async (req, res) => {
  const logHeader = "apiRole";
  logger.info(`${logHeader}`, req.body);

  try {
    logger.info(`${logHeader}: trying to insert role`);
    const [roleCheck] = await pool.query(`SELECT id FROM role WHERE name = ?`, [
      req.body.name,
    ]);
    if (roleCheck.length > 0) {
      logger.info(`${logHeader}: role '${req.body.name}' already exist`);
      return res.status(400).json({
        status: "failed",
        message: `Role ${req.body.name} already exist`,
      });
    }

    await pool.query(`INSERT INTO role (name) VALUES (?)`, [req.body.name]);

    logger.info(`${logHeader}: role inserted`);
    return res.status(201).json({
      status: "success",
      message: "Role inserted",
    });
  } catch (err) {
    logger.error(`${logHeader}: ${err}`);
    return res.status(400).json({
      status: "failed",
      message: "Server error",
    });
  }
});

app.post(
  "/api/service",
  verifyToken,
  validateSeller,
  validateBody(["skill_id", "animal_id", "price"]),
  async (req, res) => {
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
  }
);

app.get("/api/services", verifyToken, validateSeller, async (req, res) => {
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
});

app.get("/api/orders", verifyToken, validateSeller, async (req, res) => {
  const logHeader = "apiOrders";
  logger.info(`${logHeader}`, req.user.id);

  try {
    logger.info(`${logHeader}: trying to get orders`);
    const [rows] = await pool.query(
      `SELECT * FROM \`order\` INNER JOIN service ON \`order\`.service_id = service.id WHERE service.seller_id = ?`,
      [req.user.id]
    );

    const currentDt = Math.floor(Date.now() / 1000);
    let orderIdsToUpdate = [];
    rows.forEach((row) => {
      if (
        currentDt >= row.start_dt &&
        currentDt < row.end_dt &&
        row.status === 0
      ) {
        orderIdsToUpdate.push(row.id);
        row.status = 1;
      }
    });

    if (orderIdsToUpdate.length > 0) {
      await pool.query(`UPDATE \`order\` SET status = 1 WHERE id IN (?)`, [
        orderIdsToUpdate,
      ]);
    }

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
});

app.post(
  "/api/updateStatus",
  verifyToken,
  validateSeller,
  validateBody(["order_id"]),
  async (req, res) => {
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
  }
);

app.get("/api/users", verifyToken, validateAdmin, validateParams(['role_id']), async (req, res) => {
  const logHeader = "apiUsers";
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
});

app.get('/api/sellerServices', verifyToken, validateBuyer, async (req, res) => {
  const logHeader = 'apiSellerServices';
  logger.info(`${logHeader}`);

  const { animal_id, rating } = req.query;

  try {
    logger.info(`${logHeader}: trying to get seller services`);

    const queryParams = [];
    let whereClause = `WHERE user.role_id = 2`;

    if (animal_id) {
      whereClause += ` AND service.animal_id = ?`;
      queryParams.push(animal_id);
    }

    let havingClause = '';
    if (rating) {
      havingClause = `HAVING average_rating >= ?`;
      queryParams.push(parseFloat(rating));
    }

    const [sellerServices] = await pool.query(
      `
        SELECT
          user.id,
          user.full_name,
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
      'status': 'success',
      'message': 'Get seller services successful',
      'data': sellerServices
    })

  } catch (err) {
    logger.error(`${logHeader}: ${err}`);
    return res.status(500).json({
      'status': 'failed',
      'message': 'Server error'
    })
  }
})

app.get('/api/seller/:id', verifyToken, validateBuyer, async (req, res) => {
  const logHeader = 'apiSeller';
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
        status: 'failed',
        message: 'Seller not found'
      });
    }

    const seller = sellerResult[0];

    // 2. Get services by the seller
    const [services] = await pool.query(
      `
        SELECT service.id, service.price, skill.name AS skill_name, animal.name AS animal_name, skill.status AS skill_status
        FROM service
        LEFT JOIN skill ON service.skill_id = skill.id
        LEFT JOIN animal ON service.animal_id = animal.id
        WHERE service.seller_id = ?
      `,
      [id]
    );

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

    return res.status(200).json({
      status: 'success',
      message: 'Get seller successful',
      data: {
        seller,
        services,
        animals
      }
    });
  } catch (err) {
    logger.error(`${logHeader}: ${err}`);
    return res.status(500).json({
      status: 'failed',
      message: 'Server error'
    });
  }
});

app.post('/api/order', verifyToken, validateBuyer, validateBody(['service_id', 'start_dt']), async (req, res) => {
  const logHeader = 'apiOrder';
  logger.info(`${logHeader}`, req.body);

  const { service_id, start_dt, end_dt, address } = req.body;

  try {
    logger.info(`${logHeader}: trying to order`);

    // Check if service exists
    const [serviceResult] = await pool.query(
      'SELECT * FROM service INNER JOIN skill ON service.skill_id = skill.id WHERE service.id = ?',
      [service_id]
    );

    if (serviceResult.length === 0) {
      return res.status(404).json({
        status: 'failed',
        message: 'Service not found'
      });
    }

    if (serviceResult[0].status === 0) { // 0: di rumah
      logger.info(`${logHeader}: service on home, need buyer address`);
      if (!address) {
        logger.info(`${logHeader}: buyer address is not found`);
        return res.status(404).json({
          'status': 'failed',
          'message': 'Buyer address is not found'
        })
      }
    } else if (serviceResult[0].status === 1) { // 1: penitipan
      logger.info(`${logHeader}: service on seller store, need end_dt`);
      if (!end_dt) {
        logger.info(`${logHeader}: end_dt is not found`);
        return res.status(404).json({
          'status': 'failed',
          'message': 'End date is not found'
        })
      }
    } else {
      logger.info(`${logHeader}: service status is not valid`);
      return res.status(500).json({
        'status': 'failed',
        'message': 'Status is not valid'
      })
    }

    const [orderResult] = await pool.query(
      `
        INSERT INTO \`order\` (
          service_id,
          buyer_id,
          status,
          start_dt,
          end_dt,
          address
        ) VALUES (?, ?, ?, ?, ?, ?)
      `, [service_id, req.user.id, 0, start_dt, end_dt, address]
    );

    return res.status(201).json({
      'status': 'success',
      'message': 'Order succesful',
      'data': orderResult
    })

  } catch (err) {
    logger.error(`${logHeader}: ${err}`);
    return res.status(500).json({
      'status': 'failed',
      'message': 'Server error'
    })
  }
})

app.put('/api/payOrder', verifyToken, validateBuyer, validateBody(['order_id']), async (req, res) => {
  const logHeader = 'apiPayOrder';
  logger.info(`${logHeader}`, req.body);

  const { order_id } = req.body;

  try {
    logger.info(`${logHeader}: trying to pay order`);
    const [orderCheck] = await pool.query(
      `SELECT status AS status FROM \`order\` WHERE id = ?`, [order_id]
    );
    if (orderCheck[0].status === 1 || orderCheck[0].status === 2) {
      logger.info(`${logHeader}: order has already paid`);
      return res.status(403).json({
        'status': 'failed',
        'message': 'Order has already paid'
      })
    }

    const [result] = await pool.query(
      `UPDATE \`order\` SET status = 1 WHERE id = ?`, [order_id]
    );

    return res.status(201).json({
      'status': 'success',
      'message': 'Order paid'
    })
  } catch (err) {
    logger.error(`${logHeader}: ${err}`);
    return res.status(500).json({
      'status': 'failed',
      'message': 'Server error'
    })
  }
})

app.get("/api/buyerOrders", verifyToken, validateBuyer, async (req, res) => {
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
        service.skill_id AS skill_id,
        service.animal_id AS animal_id,
        service.seller_id AS seller_id,
        service.price AS price
      FROM \`order\` INNER JOIN service ON \`order\`.service_id = service.id WHERE order.buyer_id = ?`,
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
});

app.put('/api/rateOrder', verifyToken, validateBuyer, validateBody(['order_id', 'rating']), async (req, res) => {
  const logHeader = 'apiRateOrder';
  logger.info(`${logHeader}`, req.body);

  const { order_id, rating } = req.body;

  try {
    logger.info(`${logHeader}: trying to rate order`);

    const [orderCheck] = await pool.query(
      `SELECT buyer_id AS buyer_id, status AS status, rating FROM \`order\` WHERE id = ?`, [order_id]
    );
    if (orderCheck[0].buyer_id !== req.user.id) {
      logger.info(`${logHeader}: this order is not belongs to this user ${req.user.id}`);
      return res.status(403).json({
        'status': 'failed',
        'message': 'This order is not belongs to this user'
      })
    }

    if (orderCheck[0].status === 0 || orderCheck[0].status === 2) {
      logger.info(`${logHeader}: order status ${orderCheck[0].status} is not allowed`);
      return res.status(403).json({
        'status': 'failed',
        'message': 'Order status is not allowed'
      })
    }

    if (orderCheck[0].rating) {
      logger.info(`${logHeader}: order has already rated`);
      return res.status(403).json({
        'status': 'failed',
        'message': 'Order has already rated'
      })
    }

    const [result] = await pool.query(
      `UPDATE \`order\` SET rating = ? WHERE id = ?`, [rating, order_id]
    );

    return res.status(201).json({
      'status': 'success',
      'message': 'Rate order successful'
    })
  } catch (err) {
    logger.error(`${logHeader}: ${err}`);
    return res.status(500).json({
      'status': 'failed',
      'message': 'Server error'
    })
  }
})

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});

function validateRegisterBody(req, res, next) {
  const requiredFields = [
    "full_name",
    "username",
    "email",
    "password",
    "animal_id",
    "birth",
    "phone_number",
    "address",
    "role_id",
  ];

  const missingFields = requiredFields.filter(
    (field) =>
      !req.body.hasOwnProperty(field) ||
      req.body[field] === null ||
      req.body[field] === ""
  );

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: `Missing or empty required fields: ${missingFields.join(", ")}`,
    });
  }

  next();
}

function validateRequiredNameBody(req, res, next) {
  const requiredFields = ["name"];

  const missingFields = requiredFields.filter(
    (field) =>
      !req.body.hasOwnProperty(field) ||
      req.body[field] === null ||
      req.body[field] === ""
  );

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: `Missing or empty required fields: ${missingFields.join(", ")}`,
    });
  }

  next();
}

function validateLoginBody(req, res, next) {
  const requiredFields = ["email", "password"];

  const missingFields = requiredFields.filter(
    (field) =>
      !req.body.hasOwnProperty(field) ||
      req.body[field] === null ||
      req.body[field] === ""
  );

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: `Missing or empty required fields: ${missingFields.join(", ")}`,
    });
  }

  next();
}

function validateRequiredIdBody(req, res, next) {
  const requiredFields = ["id"];

  const missingFields = requiredFields.filter(
    (field) =>
      !req.body.hasOwnProperty(field) ||
      req.body[field] === null ||
      req.body[field] === ""
  );

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: `Missing or empty required fields: ${missingFields.join(", ")}`,
    });
  }

  next();
}

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "failed",
      message: "Invalid token",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;
    next();
  } catch (err) {
    return res.status(401).json({
      status: "failed",
      message: "Invalid or expired token",
    });
  }
}

function verifyRequiredChangeStatusBody(req, res, next) {
  const requiredFields = ["status"];

  const missingFields = requiredFields.filter(
    (field) =>
      !req.body.hasOwnProperty(field) ||
      req.body[field] === null ||
      req.body[field] === ""
  );

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: `Missing or empty required fields: ${missingFields.join(", ")}`,
    });
  }

  next();
}

function validateBody(bodyList = []) {
  return function (req, res, next) {
    const missingFields = bodyList.filter(
      (field) =>
        !Object.prototype.hasOwnProperty.call(req.body || {}, field) ||
        req.body[field] === null ||
        req.body[field] === ""
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: "failed",
        message: `Missing or empty required fields: ${missingFields.join(
          ", "
        )}`,
      });
    }

    next();
  };
}

function validateParams(bodyList = []) {
  return function (req, res, next) {
    const missingFields = bodyList.filter(
      (field) =>
        !Object.prototype.hasOwnProperty.call(req.query || {}, field) ||
        req.query[field] === null ||
        req.query[field] === ""
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        'status': 'failed',
        'message': `Missing or empty required fields: ${missingFields.join(", ")}`,
      });
    }

    next();
  };
}

function validateParams(bodyList = []) {
  return function (req, res, next) {
    const missingFields = bodyList.filter(
      (field) =>
        !Object.prototype.hasOwnProperty.call(req.query || {}, field) ||
        req.query[field] === null ||
        req.query[field] === ""
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        'status': 'failed',
        'message': `Missing or empty required parameters: ${missingFields.join(", ")}`,
      });
    }

    next();
  };
}

async function validateAdmin(req, res, next) {
  const adminCheck = await pool.query(
    `SELECT * FROM user WHERE id = ${req.user.id} and role_id = 1`
  );
  if (adminCheck.rows.length === 0) {
    return res.status(401).json({
      status: "failed",
      message: "Unauthorized",
    });
  }

  next();
}

async function validateSeller(req, res, next) {
  const [sellerCheck] = await pool.query(
    'SELECT * FROM user WHERE id = ? and role_id = 2', [req.user.id]
  );
  if (sellerCheck.length === 0) {
    return res.status(401).json({
      status: "failed",
      message: "Unauthorized",
    });
  }

  next();
}

async function validateBuyer(req, res, next) {
  const [adminCheck] = await pool.query(
    'SELECT * FROM user WHERE id = ? and role_id = 3', req.user.id
  );
  if (adminCheck.length === 0) {
    return res.status(401).json({
      status: "failed",
      message: "Unauthorized",
    });
  }

  next();
}



async function validateRequiredOrderBody(req, res, next) {
  const requiredFields = ["skill_id", "seller_id", "animal_id"];
}
