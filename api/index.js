require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');

// Environment variables
const PORT = process.env.PORT || 3000;
const {
  DB_HOST = 'localhost',
  DB_PORT = 3306,
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_NAME = 'demo'
} = process.env;

// Create a pool for efficient connection reuse
const pool = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const app = express();

app.get('/records', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM records');
    res.json(rows);
  } catch (err) {
    console.error('Error querying database:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/healthz', (req, res) => {
  res.send('OK');
});

app.listen(PORT, () => {
  console.log(`API service listening on port ${PORT}`);
});
