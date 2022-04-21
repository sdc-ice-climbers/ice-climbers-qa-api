const { Pool, Client } = require('pg');

const pool = new Pool({
  user: 'root',
  password: 'password',
  host: 'localhost',
  database: 'qna',
  port: 1128
});

pool.query('SELECT NOW()', (err, res) => {
  console.log(err, res)
  pool.end()
})
