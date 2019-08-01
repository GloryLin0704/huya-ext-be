const jwt = require('jsonwebtoken')

function decoded() {
  let token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjcmVhdG9yIjoiU1lTIiwicm9sZSI6IlAiLCJwcm9maWxlSWQiOiJ1bndsTEVrUlJYcmVQV0k3Ym5BOVFtdlM5TGZpY1RXaFhJIiwiYXBwSWQiOiJyY2VhYmM1ZTZiNzNjZjgyIiwiZXh0SWQiOiI2aWxnaWV2YiIsImV4cCI6MTU2NDY3MjIzMCwidXNlcklkIjoidW53bExFa1JSWHJlUFdJN2JuQTlRbXZTOUxmaWNUV2hYSSIsImlhdCI6MTU2NDY2NTAzMCwicm9vbUlkIjoiMTkyNjc3MzgifQ.PfETi3yYsiAAguTE2hZQ7W9QQrEmuY5Ghe1c-o8YcuU'
  let info
  try {
    info = jwt.verify(token, '4967d71a12a2d97da676f5fa66f151ae')
  } catch (err) {
    console.log(err)
  }
  console.log(info)
  // return
  return {
    profileId: 'unAlZrWPpz1BiQPf6x+Ei4K3nI9VEMMFFv',
    userId: 'unwlLEkRRXrePWI7bnA9QmvS9LficTWhXI'
  }
}

decoded()
module.exports = decoded
