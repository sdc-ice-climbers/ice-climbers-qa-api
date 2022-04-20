const { pool } = require('pg');
const pool = new pool();

pool.query('SELECT NOW()', (err, res) => {
  console.log(err, res)
  pool.end()
})

const res = await pool.query('SELECT NOW()')
await pool.end();
