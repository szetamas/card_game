const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

const mySQLPool = mysql.createPool({
  host: process.env.DBHOST,
  port: process.env.DBPORT,
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  database: process.env.DBNAME,
  connectionLimit: 30,
  waitForConnections: true,
  enableKeepAlive: true,
});

module.exports = { mySQLPool };
