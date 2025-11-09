// load environment variables from .env (if present)
require('dotenv').config();
const logger = require('./logger');
const mysql = require('mysql');

const pool = mysql.createPool({
  connectionLimit: process.env.DB_CONNECTION_LIMIT ? Number(process.env.DB_CONNECTION_LIMIT) : 10,
  host: process.env.DBHOST || 'localhost',
  user: process.env.DBUSER || 'root',
  password: process.env.DBPASS || '',
  database: process.env.DBNAME || 'moneymanage'
});



function query(sql, params = [], callback, req) {

  const start = Date.now();
  pool.query(sql, params, (error, results) => {
    const context = req ? `${req.method} ${req.originalUrl}` : 'NO CONTEXT';
    const txt = req && req.method === 'GET' ? 'sent' : 'affected';

    const debug = process.env.DEBUG === '1' || process.env.DEBUG === 1;
    if (debug) {
      if (error) {
        logger.error('[DB Error]', error.message);
      } else {
        const count = Array.isArray(results) ? results.length : (results && results.affectedRows) || 0;
        logger.info(`${context} | ${count} record(s) ${txt} | ${Date.now() - start} ms`);
      }
    }

    if (callback) callback(error, results);
  });
}
module.exports = { query };