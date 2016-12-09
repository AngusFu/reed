const mysql = require('mysql2/promise');
const config = require('./config')['mysql'];

const connection = function () {
  return mysql.createConnection(config);
};

async function init() {
  let conn = null;
  let result = [];

  try {
    conn = await connection();
    result = await conn.execute('SELECT * FROM `article` WHERE `aid` < ?', [55]);
    conn.end();
  } catch (e) {}

  let [rows, fields] = result;

  console.log(rows)
  if (rows && rows.length) {
    return rows;
  } else {
    return [];
  }
}

init();
