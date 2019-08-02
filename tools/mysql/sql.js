const { CC, UC, WHERE } = require('./help')

let C = (table, args, values) =>
  `INSERT INTO ${table}(${args}) VALUES(${CC(values)})`

let R = (table, args, conditions, values) =>
  conditions
    ? `SELECT ${args} FROM ${table} WHERE ${WHERE(conditions, values)}`
    : `SELECT ${args} FROM ${table}`

let U = (table, args, conditions, values) => {
  let newArgs = UC(args, values)
  return `UPDATE ${table} SET ${newArgs} WHERE ${WHERE(conditions, values)}`
}

let D = (table, conditions, values) =>
  `DELETE FROM ${table} WHERE ${WHERE(conditions, values)}`

module.exports = {
  C,
  R,
  U,
  D
}
