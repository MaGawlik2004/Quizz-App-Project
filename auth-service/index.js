const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const User = require("./models/user");
const { expressjwt: jwt } = require("express-jwt");
const jwksRsa = require("jwks-rsa");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.AUTH_PORT || 4001;
const MONGO_URI = process.env.MONGO_URI;
const KEYCLOAK_ISSUER = process.env.KEYCLOAK_ISSUER;
const KEYCLOAK_AUDIENCE = process.env.KEYCLOAK_AUDIENCE;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB error:", err);
    process.exit(1);
  });

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    jwksUri: `${KEYCLOAK_ISSUER}/protocol/openid-connect/certs`,
    cache: true,
    rateLimit: true,
  }),
  issuer: KEYCLOAK_ISSUER,
  audience: KEYCLOAK_AUDIENCE,
  algorithms: ["RS256"],
});

app.get("/profile", checkJwt, async (req, res) => {
  const { sub, preferred_username, email } = req.auth;

  let user = await User.findOne({ keycloakId: sub });
  if (!user) {
    user = new User({
      keycloakId: sub,
      username: preferred_username,
      email: email,
      provider: "keycloak",
    });
    await user.save();
  }

  res.json({
    username: user.username,
    email: user.email,
    roles: req.auth.realm_access?.roles || [],
  });
});

app.listen(PORT, () => console.log(`🚀 Auth service running on port ${PORT}`));
