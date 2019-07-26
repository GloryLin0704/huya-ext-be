const config = require('./huya-ext-config');
const jwt = require('jsonwebtoken');

// let iat = +new Date();
// let exp = +new Date() + 3600 * 1000;

let iat = +Math.round(new Date().getTime() / 1000).toString();
let exp = +Math.round(new Date().getTime() / 1000).toString() + 600;

let sToken = jwt.sign(
  {
    iat,
    exp,
    appId: config.appId
  },
  config.appSecret
);

module.exports = { sToken, iat, exp };
