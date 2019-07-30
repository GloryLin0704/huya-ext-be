let CC = values => {
    let newValues = values.reduce((acc, cur) => {
        return `${acc},'${cur}'`
    }, '')
    newValues = newValues.substring(1)

    return newValues
}

let UC = (args, values) => {
    let newArgs = args.reduce((acc, cur) => {
        return `${acc}, ${cur}='${values.shift()}'`
    }, '')
    newArgs = newArgs.substring(2)

    return newArgs
}

let WHERE = (conditions, values) => {
    let newConditions = conditions.reduce((acc, cur) => {
        return `${acc} AND ${cur}='${values.shift()}'`
    }, '')
    newConditions = newConditions.substring(5)

    return newConditions
}

module.exports = {
    CC,
    UC,
    WHERE
}
