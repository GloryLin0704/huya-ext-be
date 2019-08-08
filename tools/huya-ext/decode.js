const jwt = require('jsonwebtoken')

function decoded(token, who) {
  if (!token || token.length < 1) {
    return {
      profileId: 'unAlZrWPpz1BiQPf6x+Ei4K3nI9VEMMFFv',
      userId: 'unwlLEkRRXrePWI7bnA9QmvS9LficTWhXI'
    }
  }
  let appSecret
  if (who == 0) {
    appSecret = 'be99dd2e2667bf0ad2617dec1bd90168'
  } else {
    //cbp
    appSecret = '5968a7e7903decc83681c1bf04a28bb6'
    //梁宇
    // appSecret = 'e260ffc04aacd70ae1a90dd001e4f391' 
  }
  let info
  try {
    info = jwt.verify(token, appSecret)
  } catch (err) {
    console.log(err)
  }
  return {
    ...info
  }
}

module.exports = decoded
