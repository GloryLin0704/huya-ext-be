const { connectionForChance, db } = require('../../tools/mysql/index')
const { C, R, U, D } = require('../../tools/mysql/sql')

// 判断主播进入小程序的状态，是否没结束上一次的游戏
const statusController = async anchorID => {
  let result = await db(
    connectionForChance,
    R('anchor', ['*'], ['anchorID'], [anchorID])
  )

  console.log('12321321', anchorID)

  if (result.length) {
    console.log(1)
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
const startOrCloseController = async ({ anchorID, status }) => {
  let result = await db(
    connectionForChance,
    R('anchor', ['*'], ['anchorID'], [anchorID])
  )

  if (!Number(status)) {
    await db(connectionForChance, D('audience', ['anchorID'], [anchorID]))
    await db(connectionForChance, C('audience', ['anchorID'], [anchorID]))
    await db(
      connectionForChance,
      U(
        'anchor',
        ['lastOk', 'lastFail', 'chanceStatus', 'tick', 'tickStatus'],
        ['anchorID'],
        [0, 0, 0, 0, 'null', anchorID]
      )
    )
  }

  return result.length
    ? db(
        connectionForChance,
        U('anchor', ['status'], ['anchorID'], [status, anchorID])
      )
    : db(
        connectionForChance,
        C('anchor', ['anchorID', 'status'], [anchorID, status])
      )
}

// 获取主播预先设置的值
const getDefaultItemController = async ({ anchorID }) => {
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

// 设置成功或失败
const setSuccessController = async ({ success, anchorID, fail }) => {
  let tmp = await db(
    connectionForChance,
    R('anchor', ['success'], ['anchorID'], [anchorID])
  )
  let result = tmp[0].success
  if (result == null || result.indexOf(success) == '-1') {
    let data = `${result ? `${result},` : ''}${success}`
    await db(
      connectionForChance,
      U('anchor', ['success'], ['anchorID'], [data, anchorID])
    )
  }
  await db(
    connectionForChance,
    U('anchor', ['successChoose'], ['anchorID'], [success, anchorID])
  )

  await setFailController({ fail, anchorID })

  return {
    code: 2000,
    msg: '操作完成'
  }
}

// 主播获取成功或失败
const getSuccessController = async ({ anchorID }) => {
  let result = await db(
    connectionForChance,
    R('anchor', ['success'], ['anchorID'], [anchorID])
  )
  let data = result[0].success == null ? [] : result[0].success.split(',')
  let tmp = await getFailController({ anchorID })
  return {
    code: 2000,
    success: data,
    fail: tmp.result
  }
}

// 用户获取成功或失败
const getSuccessResultController = async ({ anchorID }) => {
  let result = await db(
    connectionForChance,
    R('anchor', ['successChoose', 'failChoose'], ['anchorID'], [anchorID])
  )
  return {
    code: 2000,
    success: result[0].successChoose,
    fail: result[0].failChoose
  }
}

// 设置失败惩罚
const setFailController = async ({ fail, anchorID }) => {
  let tmp = await db(
    connectionForChance,
    R('anchor', ['fail'], ['anchorID'], [anchorID])
  )
  let result = tmp[0].fail

  if (result == null || result.indexOf(fail) == '-1') {
    let data = `${result ? `${result},` : ''}${fail}`
    await db(
      connectionForChance,
      U('anchor', ['fail'], ['anchorID'], [data, anchorID])
    )
  }

  await db(
    connectionForChance,
    U('anchor', ['failChoose'], ['anchorID'], [fail, anchorID])
  )

  return {
    code: 2000,
    msg: '操作完成'
  }
}

// 获取失败惩罚
const getFailController = async ({ anchorID }) => {
  let result = await db(
    connectionForChance,
    R('anchor', ['fail'], ['anchorID'], [anchorID])
  )
  let data = result[0].fail == null ? [] : result[0].fail.split(',')
  return {
    code: 2000,
    result: data
  }
}

// 主播设置时间阶段
const setTickController = async ({ anchorID, time, tick, tickStatus }) => {
  await db(
    connectionForChance,
    U(
      'anchor',
      ['time', 'tick', 'tickStatus'],
      ['anchorID'],
      [time, tick, tickStatus, anchorID]
    )
  )
  console.log(time, tick, tickStatus)
  return {
    code: 2000,
    msg: '操作成功'
  }
}

// 用户获取时间阶段
const getTickController = async ({ anchorID }) => {
  let result = await db(
    connectionForChance,
    R('anchor', ['time', 'tick', 'tickStatus'], ['anchorID'], [anchorID])
  )
  console.log('getTick', anchorID, result)
  result = result[0]
  return {
    code: 2000,
    ...result
    // tick:'0',
    // tickStatus:'start',
    // time:'1231232'
  }
}

// 用户加入游戏
const takeParkInController = async ({ anchorID, id }) => {
  let result = await db(
    connectionForChance,
    R('audience', ['*'], ['anchorID'], [anchorID])
  )

  console.log('takeParkIn', result)

  let tmpResult = await db(
    connectionForChance,
    R('anchor', ['status'], ['anchorID'], [anchorID])
  )

  let ifStart = tmpResult[0].status

  // if (Number(ifStart)) {
    if (result.length) {
      if (!result[0].allAudience) {
        let audience = [id]
        await db(
          connectionForChance,
          U('audience', ['allAudience'], ['anchorID'], [audience, anchorID])
        )
        return {
          code: 2000,
          msg: '用户成功参与游戏'
        }
      }
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
			let tmp = await db(connectionForChance, R('audience', ['*'], ['anchorID'], [anchorID]))
      console.log('12321321321', tmp)
      return {
        code: 2000,
        msg: '用户成功参与游戏'
      }
    }
  // } else {
		
  //   return {
  //     code: 2006,
  //     msg: '主播还未开始游戏'
  //   }
  // }
}

// 用户提交挑战
const saveChanceController = async ({ anchorID, chance, id, name, avatar }) => {
  let result = await db(
    connectionForChance,
    R('audience', ['allVotes'], ['anchorID'], [anchorID])
  )

  console.log('saveChance', result[0])

  let ifExist = false
  if (result[0] && result[0].allVotes != null) {
    let tmp = result[0].allVotes.split(';')
    tmp.forEach(e => {
      if (e.includes(id)) {
        ifExist = true
      }
    })
  }
  if (ifExist) {
    return {
      code: 2007,
      msg: `该用户已提交过`
    }
  }

  let tmp = {
    id,
    name,
    avatar,
    chance
  }
  tmp = JSON.stringify(tmp)

  let vote = `${
    result[0].allVotes != null ? `${result[0].allVotes};` : ''
  }${tmp}`

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

  let result = ''
  console.log('getChance', tmp)
  if (tmp[0].allVotes !== null) {
    result = getRandom(tmp[0].allVotes.split(';'))
    result = JSON.parse(result)
  }

  return {
    code: 2000,
    msg: result
  }
}

// 主播选择三个选项
const setVotesController = async ({ anchorID, items }) => {
  // 这里接受的不知道是什么鬼  数组还是字符串
  // let tmp = items.split(',')
  let tmp = items
  let obj = []
  tmp.forEach((e, idx) => {
    let a = {
      id: idx,
      item: e,
      vote: 0
    }
    obj.push(a)
  })
  obj = JSON.stringify(obj)
  await db(
    connectionForChance,
    U('anchor', ['votes'], ['anchorID'], [obj, anchorID])
  )
  return {
    code: 2000,
    msg: '提交成功'
  }
}

// 用户获取三个选项
const getVotesController = async ({ anchorID }) => {
  let result = await db(
    connectionForChance,
    R('anchor', ['votes'], ['anchorID'], [anchorID])
  )
  return {
    code: 2000,
    result: JSON.parse(result[0].votes)
  }
}

// 获取投票最高结果
const getVotesResultController = async ({ anchorID }) => {
  let tmp = await getVotesController({ anchorID })
  let max = tmp.result[0]
  tmp.result.forEach(e => {
    if (e.vote > max.vote) {
      max = e
    }
  })
  return {
    code: 2000,
    result: max
  }
}

// 用户三选一票
const voteItemsController = async ({ anchorID, voteID, id }) => {
  let canVotes = true
  let tmp = await db(
    connectionForChance,
    R('audience', ['votes', 'voted'], ['anchorID'], [anchorID])
  )
  tmpVotes = tmp[0].votes

  if (tmpVotes != null && tmpVotes.includes(id)) {
    canVotes = false
  }
  if (!canVotes) {
    return {
      code: 2008,
      msg: '该用户已投票'
    }
  }
  // 更新用户表
  let _votes = id
  if (tmpVotes != null) {
    _votes = `${tmpVotes},${id}`
  }

  let tmpVoted = {
    id,
    voteID
  }
  tmpVoted = JSON.stringify(tmpVoted)

  let voted = `${tmp[0].voted != null ? `${tmp[0].voted};` : ''}${tmpVoted}`

  await db(
    connectionForChance,
    U('audience', ['votes', 'voted'], ['anchorID'], [_votes, voted, anchorID])
  )

  // 更新主播表
  let originVotes = await db(
    connectionForChance,
    R('anchor', ['votes'], ['anchorID'], [anchorID])
  )
  originVotes = JSON.parse(originVotes[0].votes)

  originVotes.forEach(e => {
    if (e.id === Number(voteID)) {
      e.vote++
    }
  })

  let newVotes = JSON.stringify(originVotes)

  await db(
    connectionForChance,
    U('anchor', ['votes'], ['anchorID'], [newVotes, anchorID])
  )

  return {
    code: 2000,
    msg: '投票成功'
  }
}

// 用户知道自己干了嘛
const bandicamController = async ({ anchorID, id }) => {
  let result = await db(
    connectionForChance,
    R('audience', ['voted', 'votes'], ['anchorID'], [anchorID])
  )
  result = result[0]
  let votedResult = undefined
  if (result.voted != null || result.voted) {
    let tmp = result.voted.split(';')
    tmp.forEach(e => {
      e = JSON.parse(e)
      if (e.id === id) {
        votedResult = e
      }
    })
  }
  if (votedResult) {
    return {
      code: 2000,
      votedResult
    }
  } else {
    return {
      code: 2010,
      msg: '用户还没投票'
    }
  }
}

const fuckHGController = async ({ anchorID, id }) => {
  let result = await db(
    connectionForChance,
    R('audience', ['allVotes'], ['anchorID'], [anchorID])
  )
  console.log('fuck', result)
  result = result[0]
  let votesResult = undefined
  if ((result && result.allVotes != null) || result.allVotes) {
    let tmp = result.allVotes.split(';')
    tmp.forEach(e => {
      e = JSON.parse(e)
      if (e.id === id) {
        votesResult = e
      }
    })
  }
  if (votesResult) {
    return {
      code: 2000,
      votesResult
    }
  } else {
    return {
      code: 2011,
      msg: '用户还没填愿望'
    }
  }
}

// 用户最后挑战投票
const voteStatusController = async ({ anchorID, voteStatus, id }) => {
  let canVotes = true
  let tmp = await db(
    connectionForChance,
    R('audience', ['lastVotes'], ['anchorID'], [anchorID])
  )
  tmpVotes = tmp[0].lastVotes
  if (tmpVotes != null && tmpVotes.includes(id)) {
    canVotes = false
  }
  if (!canVotes) {
    return {
      code: 2008,
      msg: '该用户已投票'
    }
  }
  // 更新用户表
  let _votes = id
  if (tmpVotes != null) {
    _votes = `${tmpVotes},${id}`
  }
  await db(
    connectionForChance,
    U('audience', ['lastVotes'], ['anchorID'], [_votes, anchorID])
  )

  // 更新主播表
  let originVotes = await db(
    connectionForChance,
    R('anchor', ['lastOk', 'lastFail'], ['anchorID'], [anchorID])
  )
  originVotes = originVotes[0]

  console.log('12312123', voteStatus)

  if (Number(voteStatus)) {
    console.log('s')
    originVotes.lastOk++
  } else {
    console.log('f')
    originVotes.lastFail++
  }

  await db(
    connectionForChance,
    U(
      'anchor',
      ['lastOK', 'lastFail'],
      ['anchorID'],
      [originVotes.lastOk, originVotes.lastFail, anchorID]
    )
  )

  return {
    code: 2000,
    msg: '投票成功'
  }
}

// 主播获取成功失败投票数
const returnVotesController = async ({ anchorID }) => {
  let result = await db(
    connectionForChance,
    R('anchor', ['lastOk', 'lastFail'], ['anchorID'], [anchorID])
  )
  result = result[0]
  return {
    code: 2000,
    success: result.lastOk,
    fail: result.lastFail
  }
}

// 主播获取最后挑战结果
const returnResultController = async ({ anchorID }) => {
  let result = await db(
    connectionForChance,
    R('anchor', ['lastOk', 'lastFail'], ['anchorID'], [anchorID])
  )
  result = result[0]
  let lastStatus = result.lastOk >= result.lastFail ? 'success' : 'fail'
  return {
    code: 2000,
    lastStatus
  }
}

// 主播接受或者拒绝挑战
const recOrRejController = async ({ anchorID, chanceStatus }) => {
  await db(
    connectionForChance,
    U('anchor', ['chanceStatus'], ['anchorID'], [chanceStatus, anchorID])
  )
  await db(
    connectionForChance,
    U('anchor', ['tick'], ['anchorID'], ['3', anchorID])
  )
  return {
    code: 2000,
    msg: `选择成功`
  }
}

// 用户查询主播是接受还是拒绝挑战
const getRecOrRejController = async ({ anchorID }) => {
  let result = await db(
    connectionForChance,
    R('anchor', ['chanceStatus'], ['anchorID'], [anchorID])
  )
  let chanceStatus = result[0].chanceStatus
  return {
    code: 2000,
    chanceStatus
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
  setVotesController,
  setTickController,
  getTickController,
  getVotesController,
  voteItemsController,
  voteStatusController,
  returnVotesController,
  returnResultController,
  getVotesResultController,
  recOrRejController,
  getRecOrRejController,
  getSuccessResultController,
  bandicamController,
  fuckHGController
}
