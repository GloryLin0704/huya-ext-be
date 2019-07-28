const { connectionForChance, connectionForPaint } = require('./connect');

const db = (connect, sql) => {
  return new Promise((res, rej) => {
    connect.query(sql, (err, result) => {
      if (err) {
        rej(err);
        return;
      }
      res(result);
    });
  });
};

module.exports = {
  db,
  connectionForChance,
  connectionForPaint
};
