const mysql = require('mysql');
const { paintConfig, chanceConfig } = require('./config');

const connectionForChance = mysql.createConnection(chanceConfig);
connectionForChance.connect();

const connectionForPaint = mysql.createConnection(paintConfig);
connectionForPaint.connect();

module.exports = {
  connectionForPaint,
  connectionForChance
};
