const mysql = require('mysql');
const { paintConfig, changeConfig } = require('./config');

const connectionForChange = mysql.createConnection(changeConfig);
connectionForChange.connect();

const connectionForPaint = mysql.createConnection(paintConfig);
connectionForPaint.connect();

module.exports = {
  connectionForPaint,
  connectionForChange
};
