const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  keycloakId: { type: String, unique: true },
  username: String,
  email: String,
  provider: { type: String, default: "keycloak" },
});

module.exports = mongoose.model("User", userSchema);
