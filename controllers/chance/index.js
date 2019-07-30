const { connectionForChance, db } = require('../../tools/mysql/index')
const { C, R, U, D } = require('../../tools/mysql/sql')

// 判断主播进入小程序的状态，是否没结束上一次的游戏
const statusController = async anchorID => {
  let result = await db(
    connectionForChance,
    R('anchor', ['*'], ['anchorID'], [anchorID])
  )
  if (result.length) {
    if (!Number(result[0].status)) {
      return {
        code: 2002,
        msg: `主播可以正常开始`
      }
    } else {
      return {
        code: 2003,
        time: result[0].time,
        msg: `主播上次游戏没结束`
      }
    }
  } else {
    await db(connectionForChance, C('anchor', ['anchorID'], [anchorID]))
    return {
      code: 2001,
      msg: `主播第一次进入`
    }
  }
}

// 主播点击开始/结束小程序
const startOrCloseController = async ({ anchorID, status, time }) => {
  let result = await db(
    connectionForChance,
    R('anchor', ['*'], ['anchorID'], [anchorID])
  )

  if (!Number(status)) {
    await db(connectionForChance, D('audience', ['anchorID'], [anchorID]))
  }

  return result.length
    ? db(
        connectionForChance,
        U('anchor', ['status', 'time'], ['anchorID'], [status, time, anchorID])
      )
    : db(
        connectionForChance,
        C('anchor', ['anchorID', 'status', 'time'], [anchorID, status, time])
      )
}

// 获取主播预先设置的值
const getDefaultItemController = async ({ anchorID }) => {
  console.log(anchorID)
  let result = await db(
    connectionForChance,
    R('anchor', ['defaultItems'], ['anchorID'], [anchorID])
  )

  if (!result[0]) {
    return {
      code: 2004,
      msg: `主播还没有预设值`
    }
  } else {
    let tmp = result[0].defaultItems
    tmp = tmp.substr(1, tmp.length - 2)
    tmp = JSON.parse(tmp)
    return {
      code: 2000,
      data: tmp
    }
  }
}

// 主播设置默认值
const setDefaultItemController = async ({ anchorID, items }) => {
  await db(
    connectionForChance,
    U('anchor', ['defaultItems'], ['anchorID'], [items, anchorID])
  )

  return {
    code: 2000,
    msg: '操作成功'
  }
}

// 设置成功奖励
const setSuccessController = async ({ success, anchorID }) => {
  let tmp = await db(
    connectionForChance,
    R('anchor', ['success'], ['anchorID'], [anchorID])
  )
  let result = tmp[0].success
  let data = `${result ? `${result},` : ''}${success}`
  console.log(data)
  await db(
    connectionForChance,
    U('anchor', ['success'], ['anchorID'], [data, anchorID])
  )
  return {
    code: 200,
    msg: '操作完成'
  }
}

// 获取成功奖励
const getSuccessController = async ({ anchorID }) => {
  let result = await db(
    connectionForChance,
    R('anchor', ['success'], ['anchorID'], [anchorID])
  )
  let data = result[0].success.length < 1 ? [] : result[0].success.split(',')
  return {
    code: 200,
    result: data
  }
}

// 设置失败惩罚
const setFailController = async ({ fail, anchorID }) => {
  let tmp = await db(
    connectionForChance,
    R('anchor', ['fail'], ['anchorID'], [anchorID])
  )
  let result = tmp[0].fail
  let data = `${result ? `${result},` : ''}${fail}`
  // console.log(data)
  await db(
    connectionForChance,
    U('anchor', ['fail'], ['anchorID'], [data, anchorID])
  )
  return {
    code: 200,
    msg: '操作完成'
  }
}

// 获取失败惩罚
const getFailController = async ({ anchorID }) => {
  let result = await db(
    connectionForChance,
    R('anchor', ['fail'], ['anchorID'], [anchorID])
  )
  let data = result[0].fail.length < 1 ? [] : result[0].fail.split(',')
  return {
    code: 200,
    result: data
  }
}

// 用户加入游戏
const takeParkInController = async ({ anchorID, id }) => {
  let result = await db(
    connectionForChance,
    R('audience', ['*'], ['anchorID'], [anchorID])
  )

  let tmpResult = await db(
    connectionForChance,
    R('anchor', ['status'], ['anchorID'], [anchorID])
  )

  let ifStart = tmpResult[0].status

  if (Number(ifStart)) {
    if (result.length) {
      let ids = result[0].allAudience
      ids = ids.split(',')
      if (ids.includes(id)) {
        return {
          code: 2005,
          msg: '用户已参与游戏'
        }
      } else {
        ids.push(id)
      }
      await db(
        connectionForChance,
        U('audience', ['allAudience'], ['anchorID'], [ids, anchorID])
      )
      return {
        code: 2000,
        msg: '用户成功参与游戏'
      }
    } else {
      let audience = [id]
      await db(
        connectionForChance,
        C('audience', ['anchorID', 'allAudience'], [anchorID, audience])
      )
      return {
        code: 2000,
        msg: '用户成功参与游戏'
      }
    }
  } else {
    return {
      code: 2006,
      msg: '主播还未开始游戏'
    }
  }
}

// 用户提交挑战
const saveChanceController = async ({ anchorID, chance, id }) => {
  let result = await db(
    connectionForChance,
    R('audience', ['allVotes'], ['anchorID'], [anchorID])
  )

  let ifExist = false
  if (result[0]) {
    let tmp = result[0].allVotes.split(';')
    tmp.forEach(e => {
      if (e.includes(id)) {
        ifExist = true
      }
    })
  }
  if (ifExist) {
    return {
      code: 2006,
      msg: `该用户已提交过`
    }
  }

  let tmp = {
    id,
    chance
  }
  tmp = JSON.stringify(tmp)

  let vote = `${result[0].allVotes ? `${result[0].allVotes};` : ''}${tmp}`

  await db(
    connectionForChance,
    U('audience', ['allVotes'], ['anchorID'], [vote, anchorID])
  )

  return {
    code: 2000,
    msg: '提交成功'
  }
}

// 随机获取用户挑战
const getChanceController = async ({ anchorID }) => {
  let tmp = await db(
    connectionForChance,
    R('audience', ['allVotes'], ['anchorID'], [anchorID])
  )

  function getRandom(arr) {
    let len = arr.length
    let random = Math.floor(Math.random() * len)
    return arr[random]
  }

  let result = getRandom(tmp[0].allVotes.split(';'))
  result = JSON.parse(result)

  return {
    code: 2000,
    msg: result
  }
}

// 选择三个选项
const setVotesController = async ({ anchorID, items }) => {
  // 这里接受的不知道是什么鬼  数组还是字符串
  let tmp = JSON.parse(items)
  let obj = []
  tmp.forEach((e, idx) => {
    let a = {
      id: idx,
      item: e,
      vote: 0
    }
    obj.push(a)
  })
  console.log(obj)
  console.log(JSON.stringify(obj))
  await db(
    connectionForChance,
    U('anchor', ['votes'], ['anchorID'], [items, anchorID])
  )
  return {
    code: 2000,
    msg: '提交成功'
  }
}

module.exports = {
  statusController,
  startOrCloseController,
  getDefaultItemController,
  setDefaultItemController,
  takeParkInController,
  saveChanceController,
  setSuccessController,
  getSuccessController,
  setFailController,
  getFailController,
  getChanceController,
  setVotesController
}
