const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER || "quizuser",
  host: process.env.DB_HOST || "quiz-db",
  database: process.env.DB_NAME || "quiz",
  password: process.env.DB_PASSWORD || "quizpass",
  port: process.env.DB_PORT || "5432",
});

const initDB = async () => {
  try {
    const initScript = fs
      .readFileSync(path.join(__dirname, "../../init.sql"))
      .toString();

    await pool.query(initScript);
    console.log("Baza danych została zainicjalizowana.");
  } catch (err) {
    console.error(`Błąd inicjalizaji bazy danych: ${err}`);
  }
};

pool.connect((err, client, done) => {
  if (err) {
    console.error(`Błąd połączenia z bazą danych: ${err}`);
  } else {
    console.log("Połączenie z bazą danych ustawione.");
    done();
    initDB();
  }
});

module.exports = {
  pool,
  initDB,
};
