const { connectionForPaint, db } = require('../../tools/mysql/index')
const { C, R, U, D } = require('../../tools/mysql/sql')

// 判断主播进入小程序的状态，是否没结束上一次的游戏
const statusController = async anchorID => {
  let result = await db(
    connectionForPaint,
    R('anchor', ['*'], ['anchorID'], [anchorID])
  )
  console.log(result)
  if (result.length) {
    if (!Number(result[0].status)) {
      return {
        code: 2002
      }
    } else {
      return {
        code: 2003,
        time: result[0].time
      }
    }
  } else {
    return {
      code: 2001
    }
  }
}

// 主播点击开始/结束小程序
const startOrCloseController = async ({ anchorID, status, time }) => {
  let result = await db(
    connectionForPaint,
    R('anchor', ['*'], ['anchorID'], [anchorID])
  )

  if (!Number(status)) {
    await db(connectionForPaint, D('audience', ['anchorID'], [anchorID]))
  }

  return result.length
    ? db(
        connectionForPaint,
        U('anchor', ['status', 'time'], ['anchorID'], [status, time, anchorID])
      )
    : db(
        connectionForPaint,
        C('anchor', ['anchorID', 'status', 'time'], [anchorID, status, time])
      )
}

// 观众加入小程序
const takeParkInController = async ({ anchorID, id }) => {
  let result = await db(
    connectionForPaint,
    R('audience', ['*'], ['anchorID'], [anchorID])
  )

  let tmpResult = await db(
    connectionForPaint,
    R('anchor', ['status'], ['anchorID'], [anchorID])
  )

  let ifStart = tmpResult[0].status

  if (Number(ifStart)) {
    if (result.length) {
      let ids = result[0].allAudience
      ids = ids.split(',')
      if (ids.includes(id)) {
        return {
          code: 2004,
          msg: '该用户已经参与游戏'
        }
      } else {
        ids.push(id)
      }
      await db(
        connectionForPaint,
        U('audience', ['allAudience'], ['anchorID'], [ids, anchorID])
      )
      return {
        code: 200,
        msg: '用户成功参与游戏'
      }
    } else {
      let audience = [id]
      await db(
        connectionForPaint,
        C('audience', ['anchorID', 'allAudience'], [anchorID, audience])
      )
      return {
        code: 200,
        msg: '用户成功参与游戏'
      }
    }
  } else {
    return {
      code: 2005,
      msg: '主播还未开始游戏'
    }
  }
}

// 获取时间
const getStartTimeController = async ({ anchorID }) => {
  let tmp = await db(
    connectionForPaint,
    R('anchor', ['time'], ['anchorID'], [anchorID])
  )
  let startTime = tmp[0].time
  return {
    code: 200,
    startTime
  }
}

// 主播绘制作品
const savePathAnchorController = async ({ anchorID, path }) => {
  console.log(typeof path)
  path = JSON.stringify(path)
  let result = await db(
    connectionForPaint,
    R('anchor', ['status'], ['anchorID'], [anchorID])
  )

  if (Number(result[0].status)) {
    return db(
      connectionForPaint,
      U('anchor', ['curPath'], ['anchorID'], [path, anchorID])
    )
  } else {
    throw new Error()
  }
}

// 观众绘画
const savePaintAudienceController = async ({ anchorID, id, path }) => {
  let result = await db(
    connectionForPaint,
    R('audience', ['*'], ['anchorID'], [anchorID])
  )
  let tmp = result[0].allPath

  let ifExist = false
  if (tmp) {
    tmp.split(';').forEach(e => {
      e = JSON.parse(e)
      if (e.id === id) {
        ifExist = true
      }
    })
  }

  if (ifExist) {
    return {
      code: 2007,
      msg: `该用户在本次游戏已提交`
    }
  }

  let data = JSON.stringify({
    id,
    path
  })
  tmp = `${tmp ? tmp : ''}${tmp ? ';' : ''}${data}`

  await db(
    connectionForPaint,
    U('audience', ['allPath'], ['anchorID'], [tmp, anchorID])
  )
  return {
    code: 200,
    msg: `用户绘制成功`
  }
}

// 主播点击结束两端 rank / 或者关闭进来游戏未结束
const getRankController = async ({ identify, anchorID, id }) => {
  let Uresult = await db(
    connectionForPaint,
    R('anchor', ['rank', 'curPath'], ['anchorID'], [anchorID])
  )
  if (identify === 'U') {
    return {
      rank: Uresult[0].rank,
      anchorPath: Uresult[0].curPath
    }
  } else {
    let result = await db(
      connectionForPaint,
      R('anchor', ['curPath'], ['anchorID'], [anchorID])
    )
    let tmp = await db(
      connectionForPaint,
      R('audience', ['allPath'], ['anchorID'], [anchorID])
    )
    let selfPath
    tmp[0].allPath.split(';').forEach(e => {
      e = JSON.parse(e)
      if (e.id === id) {
        selfPath = e.path
      }
    })
    if (selfPath) {
      return {
        anchorPath: result[0].curPath,
        rank: Uresult[0].rank,
        selfPath
      }
    } else {
      return {
        anchorPath: result[0].curPath,
        msg: '用户还没绘制'
      }
    }
  }
}

const againIntoController = async ({ anchorID, id }) => {
  console.log(anchorID, id)
  let result = await db(
    connectionForPaint,
    R('anchor', ['curPath'], ['anchorID'], [anchorID])
  )
  let tmp = await db(
    connectionForPaint,
    R('audience', ['allPath'], ['anchorID'], [anchorID])
  )
  let selfPath
  tmp[0].allPath.split(';').forEach(e => {
    e = JSON.parse(e)
    if (e.id === id) {
      selfPath = e.path
    }
  })
}

// 用户是否可以开始绘画
const canPaintController = async ({ anchorID }) => {
  let result = await db(
    connectionForPaint,
    R('anchor', ['gameTime'], ['anchorID'], [anchorID])
  )

  console.log(result[0])

  let gameTime = result[0].gameTime

  if (gameTime) {
    return {
      status: true,
      gameTime
    }
  } else {
    return {
      status: false
    }
  }
}

module.exports = {
  statusController,
  startOrCloseController,
  savePathAnchorController,
  takeParkInController,
  savePaintAudienceController,
  getRankController,
  canPaintController,
  getStartTimeController,
  againIntoController
}
