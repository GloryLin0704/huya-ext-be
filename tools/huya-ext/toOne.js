module.exports = function(rank) {
  if (rank.length < 1) {
    return []
  }

  let tmp = rank.map(e => {
    let min = Math.min(e.dis, 300)
    let tmpValue = (1 - min / 300) * 100
    e.dis = tmpValue
    return e
  })

  return tmp
}
