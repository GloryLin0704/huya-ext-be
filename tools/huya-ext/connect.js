const rp = require('request-promise-native');
const { sToken, iat, exp } = require('./jwt');
const { appId } = require('./huya-ext-config');

let options = {
  url: 'https://open-apiext.huya.com/channel/index',
  qs: {
    appId,
    iat,
    exp,
    sToken
  }
};
let url = `https://open-apiext.huya.com/channel/index?do=getLiveGiftInfoList&roomId=518512&appId=${appId}&iat=${iat}&exp=${exp}&sToken=${sToken}`;
console.log(url);
rp(url)
  .then(function(res) {
    console.log(res);
  })
  .catch(function(err) {
    console.log(err);
  });
