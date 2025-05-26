const jwt = require("jsonwebtoken");

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

module.exports = {
  verifyToken,
  validateBody
};
