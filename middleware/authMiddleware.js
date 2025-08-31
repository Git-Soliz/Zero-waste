const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1]; // Format: Bearer <token>
  if (!token) {
    return res.status(401).json({ error: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // į request pridėsim user info
    next();
  } catch (err) {
    res.status(401).json({ error: "Token is not valid" });
  }
}

module.exports = authMiddleware;
