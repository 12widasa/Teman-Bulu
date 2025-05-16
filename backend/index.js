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

const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Database connected at:", res.rows[0].now);
  }
});
app.use(cors());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // jika pakai cookie/token
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.post("/api/register", validateRegisterBody, async (req, res) => {
  const logHeader = "apiRegister";
  logger.info(`${logHeader}`, req.body);

  try {
    logger.debug(`${logHeader}: trying to register user`);
    const userCheck = await pool.query(
      `SELECT id FROM "user" WHERE email = '${req.body.email}' OR username = '${req.body.username}' OR phone_number = '${req.body.phone_number}'`
    );

    if (userCheck.rows.length > 0) {
      logger.debug(
        `${logHeader}: email or username or phone number already exist`
      );
      return res.status(400).json({
        status: "failed",
        message: "Email or username or phone number already exist",
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const result = await pool.query(
      `
				INSERT INTO "user" (
					full_name,
					username,
					email,
					password,
					animal_id,
					birth,
					phone_number,
					address,
					profile,
					cv,
					certificate,
					role_id
				)
				VALUES (
					'${req.body.full_name}',
					'${req.body.username}',
					'${req.body.email}',
					'${hashedPassword}',
					${req.body.animal_id},
					'${req.body.birth}',
					'${req.body.phone_number}',
					'${req.body.address}',
					${req.body.profile ? req.body.profile : null},
					${req.body.cv ? req.body.cv : null},
					${req.body.certificate ? req.body.certificate : null},
					${req.body.role_id}
				)
			`
    );

    return res.status(201).json({
      status: "success",
      message: "User registered",
      data: result.rows[0],
    });
  } catch (err) {
    logger.error(`${logHeader}: ${err}`);
    return res.status(500).json({
      status: "failed",
      message: "Server error",
    });
  }
});

app.post("/api/login", validateLoginBody, async (req, res) => {
  const logHeader = "apiLogin";
  logger.info(`${logHeader}`, req.body);

  const { email, password } = req.body;

  try {
    const result = await pool.query(
      `SELECT * FROM "user" WHERE email = '${email}'`
    );

    if (result.rows.length === 0) {
      logger.info(`${logHeader}: invalid email or password`);
      return res.status(401).json({
        status: "failed",
        message: "Invalid email or password",
      });
    }

    const user = result.rows[0];
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
      // user is not admin
      logger.info(`${logHeader}: user is not admin`);
      return res.status(401).json({
        status: "failed",
        message: "Unauthorized",
      });
    }

    try {
      logger.info(`${logHeader}: trying to verify seller`);
      const { id } = req.body;

      const result = await pool.query(
        `SELECT id FROM "user" WHERE id = ${id} and role_id = 2`
      );
      if (result.rows.length === 0) {
        logger.info(`${logHeader}: seller is not found`);
        return res.status(404).json({
          status: "failed",
          message: "Seller is not found",
        });
      }

      const updateResult = await pool.query(
        `UPDATE "user" SET verified = true WHERE id = ${id} and role_id = 2`
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
      const result = await pool.query(`DELETE FROM "user" WHERE id = ${id}`);

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
      const result = await pool.query(
        `UPDATE "user" SET status = ${status} WHERE id = ${req.user.id} AND role_id = 2`
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

app.post(
  "/api/order",
  verifyToken,
  validateBuyer,
  validateBody(["service_id", 'start_dt', 'end_dt']),
  async (req, res) => {
    const logHeader = "apiOrder";
    logger.info(`${logHeader}`, req.body);

    const { service_id, start_dt, end_dt } = req.body;

    try {
      logger.info(`${logHeader}: trying to order`);
      const result = await pool.query(
        `INSERT INTO "order" (service_id, buyer_id, start_dt, end_dt) VALUES (${service_id}, ${req.user.id}, ${start_dt}, ${end_dt})`
      );

      return res.status(201).json({
        status: "success",
        message: "Order successful",
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
    const result = await pool.query(`SELECT * FROM animal`);

    return res.status(200).json({
      status: "success",
      message: "Get animals successful",
      data: result.rows,
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
    const skillCheck = await pool.query(
      `SELECT id FROM skill WHERE name = '${req.body.name}'`
    );
    if (skillCheck.rows.length > 0) {
      logger.info(`${logHeader}: skill '${req.body.name}' already exist`);
      return res.status(400).json({
        status: "failed",
        message: `Skill ${req.body.name} already exist`,
      });
    }

    const result = await pool.query(
      `INSERT INTO skill (name) VALUES ('${req.body.name}')`
    );

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
    const animalCheck = await pool.query(
      `SELECT id FROM animal WHERE name = '${req.body.name}'`
    );
    if (animalCheck.rows.length > 0) {
      logger.info(`${logHeader}: animal '${req.body.name}' already exist`);
      return res.status(400).json({
        status: "failed",
        message: `Animal ${req.body.name} already exist`,
      });
    }

    const result = await pool.query(
      `INSERT INTO animal (name) VALUES ('${req.body.name}')`
    );

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
    const roleCheck = await pool.query(
      `SELECT id FROM role WHERE name = '${req.body.name}'`
    );
    if (roleCheck.rows.length > 0) {
      logger.info(`${logHeader}: role '${req.body.name}' already exist`);
      return res.status(400).json({
        status: "failed",
        message: `Role ${req.body.name} already exist`,
      });
    }

    const result = await pool.query(
      `INSERT INTO role (name) VALUES ('${req.body.name}')`
    );

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

app.post('/api/service', verifyToken, validateSeller, validateBody(['skill_id', 'animal_id', 'price']), async (req, res) => {
  const logHeader = 'apiService';
  logger.info(`${logHeader}`, req.body);

  const { skill_id, animal_id, price } = req.body;

  try {
    logger.info(`${logHeader}: trying to insert service`);
    const result = await pool.query(
      `INSERT INTO service (skill_id, animal_id, seller_id, price) VALUES (${skill_id}, ${animal_id}, ${req.user.id}, ${price})`
    );

    return res.status(201).json({
      'status': 'success',
      'message': 'Service inserted'
    })
  } catch (err) {
    logger.error(`${logHeader}: ${err}`);
    return res.status(500).json({
      'status': 'failed',
      'message': 'Server error'
    })
  }
})

app.get('/api/services', verifyToken, validateSeller, async (req, res) => {
  const logHeader = 'apiServices';
  logger.info(`${logHeader}`, req.user.id)

  try {
    logger.info(`${logHeader}: trying to get services`);
    const result = await pool.query(
      `SELECT * FROM service WHERE seller_id = ${req.user.id}`
    );

    return res.status(200).json({
      'status': 'success',
      'message': 'Get services successful',
      'data': result.rows
    })
  } catch (err) {
    logger.error(`${logHeader}: ${err}`);
    return res.status(500).json({
      'status': 'failed',
      'message': 'Server error'
    })
  }
})

app.get('/api/orders', verifyToken, validateSeller, async (req, res) => {
  const logHeader = 'apiOrders';
  logger.info(`${logHeader}`, req.user.id);

  try {
    logger.info(`${logHeader}: trying to get orders`);
    const result = await pool.query(
      `SELECT * FROM "order" INNER JOIN service ON "order".service_id = service.id WHERE service.seller_id = ${req.user.id}`
    );

    const currentDt = Math.floor(Date.now() / 1000);
    let orderIdsToUpdate = [];
    result.rows.forEach(row => {
      if (currentDt >= row['start_dt'] && currentDt < row['end_dt'] && row['status'] === 0) {
        orderIdsToUpdate.push(row['id']);
        row['status'] = 1;
      }
    })

    const updateStatus = await pool.query(
      `UPDATE "order" SET status = 1 WHERE id = ANY($1::int[])`, [orderIdsToUpdate]
    );

    let willTakePlaceCount = 0;
    let takingPlaceCount = 0;
    let finishedCount = 0;

    result.rows.forEach(row => {
      if (row['status'] === 0) willTakePlaceCount += 1;
      else if (row['status'] === 1) takingPlaceCount += 1;
      else if (row['status'] === 2) finishedCount += 1;
    })

    return res.status(200).json({
      'status': 'success',
      'message': 'Get orders successful',
      'data': {
        'akan_berlangsung': willTakePlaceCount,
        'berlangsung': takingPlaceCount,
        'selesai': finishedCount,
        'orders': result.rows
      }
    })
  } catch (err) {
    logger.error(`${logHeader}: ${err}`);
    return res.status(500).json({
      'status': 'failed',
      'message': 'Server error'
    })
  }
})

app.post('/api/updateStatus', verifyToken, validateSeller, validateBody(['order_id']), async (req, res) => {
  const logHeader = 'apiUpdateStatus';
  logger.info(`${logHeader}`, req.body);

  const { order_id } = req.body;

  try {
    logger.info(`${logHeader}: trying to update order status`);
    const result = await pool.query(
      `UPDATE "order" SET status = 2 WHERE id = ${order_id} AND status = 1`
    );

    return res.status(201).json({
      'status': 'success',
      'message': 'Order status updated'
    })
  } catch (err) {
    logger.error(`${logHeader}: ${err}`);
    return res.status(201).json({
      'status': 'failed',
      'message': 'Server error'
    })
  }
})

app.get("/api/users", verifyToken, validateAdmin, async (req, res) => {
  const logHeader = "apiUsers";
  logger.info(`${logHeader}`);

  try {
    logger.info(`${logHeader}: trying to get users data`);
    const result = await pool.query(`SELECT * FROM "user" WHERE role_id != 1`);

    return res.status(200).json({
      status: "success",
      message: "Get users successful",
      data: result.rows,
    });
  } catch (err) {
    logger.error(`${logHeader}: ${err}`);
    return res.status(500).json({
      status: "failed",
      message: "Server error",
    });
  }
});

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
        'status': 'failed',
        'message': `Missing or empty required fields: ${missingFields.join(", ")}`,
      });
    }

    next();
  };
}

async function validateAdmin(req, res, next) {
  const adminCheck = await pool.query(
    `SELECT * FROM "user" WHERE id = ${req.user.id} and role_id = 1`
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
  const adminCheck = await pool.query(
    `SELECT * FROM "user" WHERE id = ${req.user.id} and role_id = 2`
  );
  if (adminCheck.rows.length === 0) {
    return res.status(401).json({
      status: "failed",
      message: "Unauthorized",
    });
  }

  next();
}

async function validateBuyer(req, res, next) {
  const adminCheck = await pool.query(
    `SELECT * FROM "user" WHERE id = ${req.user.id} and role_id = 3`
  );
  if (adminCheck.rows.length === 0) {
    return res.status(401).json({
      status: "failed",
      message: "Unauthorized",
    });
  }

  next();
}

async function validateRequiredIdParams(req, res, next) {
  const requiredFields = ["id"];

  const missingFields = requiredFields.filter((p) => !req.params[p]);

  if (missingFields.length > 0) {
    return res.status(400).json({
      status: "failed",
      message: `Missing or empty required params: ${missingFields.join(", ")}`,
    });
  }

  next();
}

async function validateRequiredOrderBody(req, res, next) {
  const requiredFields = ["skill_id", "seller_id", "animal_id"];
}
