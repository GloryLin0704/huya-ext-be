const jwt = require('jsonwebtoken')

function decoded(token, who) {
  let appSecret
  if (who == 0) {
    appSecret = 'be99dd2e2667bf0ad2617dec1bd90168'
  } else {
    appSecret = '4967d71a12a2d97da676f5fa66f151ae'
  }
  let info
  try {
    info = jwt.verify(token, appSecret)
  } catch (err) {
    console.log(err)
  }
  return {
    profileId: 'unAlZrWPpz1BiQPf6x+Ei4K3nI9VEMMFFv',
    userId: 'unwlLEkRRXrePWI7bnA9QmvS9LficTWhXI',
    info
  }
}

module.exports = decoded
