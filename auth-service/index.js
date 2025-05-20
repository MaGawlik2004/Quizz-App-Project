const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const users = [];

const PORT = process.env.AUTH_PORT || 4001;
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const existing = users.find((u) => u.username === username);
  if (existing) return res.status(400).json({ error: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  res.json({ message: "User registered" });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

app.listen(PORT, () => console.log(`Auth service running on ${PORT}`));
