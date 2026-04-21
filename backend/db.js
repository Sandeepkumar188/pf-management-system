const mysql = require('mysql2');

const db = mysql.createConnection({
  socketPath: '/var/run/mysqld/mysqld.sock',
  user: 'root',
  password: 'root123',
  database: 'pf_system'
});

db.connect((err) => {
  if (err) {
    console.log(' Database Error:', err);
  } else {
    console.log(' Database Connected!');
  }
});

module.exports = db;
