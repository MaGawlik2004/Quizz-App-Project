const jwt = require("jsonwebtoken");

function extractUserIdFromToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Brak tokena" });
  }

  try {
    const decoded = jwt.decode(token);
    req.userId = decoded.sub;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Nieprawidłowy token" });
  }
}

module.exports = { extractUserIdFromToken };
