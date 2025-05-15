const express = require("express");
const app = express();
const port = 3000;

const winston = require("winston");
const { combine, timestamp, json, printf } = winston.format;
const timestampFormat = 'YYYY-MM-DD HH:mm:ss';
const logger = winston.createLogger({
	format: combine(
			timestamp({ format: timestampFormat }),
			json(),
			printf(({ timestamp, level, message, ...data }) => {
					const response = {
							level,
							timestamp,
							message
					};

					if (Object.keys(data).length > 0) {
						response.data = data;
					}
					return JSON.stringify(response);
			})
	),
	transports: [
			new winston.transports.Console()
	],
});
const bcrypt = require("bcryptjs");

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
			logger.debug(`${logHeader}: email or username or phone number already exist`)
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
					skill_id,
					animal_id,
					birth_place,
					birth_date,
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
					${req.body.skill_id},
					${req.body.animal_id},
					'${req.body.birth_place}',
					'${req.body.birth_date}',
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

app.post("/api/login", (req, res) => {
  const logHeader = "apiLogin";
  logger.info(`${logHeader}`, req.body);
});

app.post("/api/skill", validateRequiredNameBody, async (req, res) => {
	const logHeader = 'apiSkill';
	logger.info(`${logHeader}`, req.body);

	try {
		logger.info(`${logHeader}: trying to insert skill`);
		const skillCheck = await pool.query(
			`SELECT id FROM skill WHERE name = '${req.body.name}'`
		);
		if (skillCheck.rows.length > 0) {
			logger.info(`${logHeader}: skill '${req.body.name}' already exist`);
			return res.status(400).json({
				'status': 'failed',
				'message': `Skill ${req.body.name} already exist`
			})
		}

		const result = await pool.query(
			`INSERT INTO skill (name) VALUES ('${req.body.name}')`
		);

		logger.info(`${logHeader}: skill inserted`)
		return res.status(201).json({
			'status': 'success',
			'message': 'Skill inserted'
		})
	} catch (err) {
		logger.error(`${logHeader}: ${err}`);
		return res.status(400).json({
			'status': 'failed',
			'message': 'Server error'
		})
	}
});

app.post("/api/animal", validateRequiredNameBody, async (req, res) => {
	const logHeader = 'apiAnimal';
	logger.info(`${logHeader}`, req.body);

	try {
		logger.info(`${logHeader}: trying to insert animal`);
		const animalCheck = await pool.query(
			`SELECT id FROM animal WHERE name = '${req.body.name}'`
		);
		if (animalCheck.rows.length > 0) {
			logger.info(`${logHeader}: animal '${req.body.name}' already exist`);
			return res.status(400).json({
				'status': 'failed',
				'message': `Animal ${req.body.name} already exist`
			})
		}

		const result = await pool.query(
			`INSERT INTO animal (name) VALUES ('${req.body.name}')`
		);

		logger.info(`${logHeader}: animal inserted`)
		return res.status(201).json({
			'status': 'success',
			'message': 'Animal inserted'
		})
	} catch (err) {
		logger.error(`${logHeader}: ${err}`);
		return res.status(400).json({
			'status': 'failed',
			'message': 'Server error'
		})
	}
});

app.post("/api/role", validateRequiredNameBody, async (req, res) => {
	const logHeader = 'apiRole';
	logger.info(`${logHeader}`, req.body);

	try {
		logger.info(`${logHeader}: trying to insert role`);
		const roleCheck = await pool.query(
			`SELECT id FROM role WHERE name = '${req.body.name}'`
		);
		if (roleCheck.rows.length > 0) {
			logger.info(`${logHeader}: role '${req.body.name}' already exist`);
			return res.status(400).json({
				'status': 'failed',
				'message': `Role ${req.body.name} already exist`
			})
		}

		const result = await pool.query(
			`INSERT INTO role (name) VALUES ('${req.body.name}')`
		);

		logger.info(`${logHeader}: role inserted`)
		return res.status(201).json({
			'status': 'success',
			'message': 'Role inserted'
		})
	} catch (err) {
		logger.error(`${logHeader}: ${err}`);
		return res.status(400).json({
			'status': 'failed',
			'message': 'Server error'
		})
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
    "skill_id",
    "animal_id",
    "birth_place",
    "birth_date",
    "phone_number",
    "address",
    "role_id"
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
  const requiredFields = ['name'];

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
