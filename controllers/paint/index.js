const { connectionForPaint, db } = require('../../tools/mysql/index')
const { C, R, U, D } = require('../../tools/mysql/sql')
const distance = require('../../tools/huya-ext/distance')
const toOne = require('../../tools/huya-ext/toOne')

// 判断主播进入小程序的状态，是否没结束上一次的游戏
const statusController = async anchorID => {
  let result = await db(
    connectionForPaint,
    R('anchor', ['*'], ['anchorID'], [anchorID])
  )
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
    await db(connectionForPaint, C('audience', ['anchorID'], [anchorID]))
    await db(
      connectionForPaint,
      U('anchor', ['isPaint', 'rank'], ['anchorID'], [0, '', anchorID])
    )
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
    if (!result.length) {
      let audience = [id]
      await db(
        connectionForPaint,
        C('audience', ['anchorID', 'allAudience'], [anchorID, audience])
      )
      return {
        code: 200,
        msg: '用户成功参与游戏'
      }
    } else if (result[0].allAudience == null) {
      let audience = [id]
      await db(
        connectionForPaint,
        U('audience', ['allAudience'], ['anchorID'], [audience, anchorID])
      )
      return {
        code: 200,
        msg: '用户成功参与游戏'
      }
    } else {
      let ids = result[0].allAudience
      ids = ids.split(',')
      for (let i = 0; i < ids.length; i++) {
        if (ids[i] == id) {
          return {
            code: 2004,
            msg: '该用户已经参与游戏'
          }
        }
      }
      ids.push(id)
      await db(
        connectionForPaint,
        U('audience', ['allAudience'], ['anchorID'], [ids, anchorID])
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
  path = JSON.stringify(path)
  let result = await db(
    connectionForPaint,
    R('anchor', ['status', 'isPaint'], ['anchorID'], [anchorID])
  )
  if (result[0].isPaint) {
    return {
      code: 2008,
      msg: '主播已经绘制过'
    }
  }

  if (Number(result[0].status)) {
    await db(
      connectionForPaint,
      U('anchor', ['curPath', 'isPaint'], ['anchorID'], [path, 1, anchorID])
    )
    return {
      code: 200,
      msg: '主播绘制成功'
    }
  } else {
    throw new Error()
  }
}

// 观众绘画
const savePaintAudienceController = async ({
  anchorID,
  id,
  path,
  name,
  avatar
}) => {
  let result = await db(
    connectionForPaint,
    R('audience', ['*'], ['anchorID'], [anchorID])
  )
  let tmp = result[0].allPath

  let ifExist = false
  if (tmp) {
    tmp.split(';').forEach(e => {
      e = JSON.parse(`${e}`)
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

  path = JSON.parse(path)

  let data = JSON.stringify({
    id,
    name,
    avatar,
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

// 发起请求，对比相似度，返回 rank
const getSimilarityController = async ({ anchorID }) => {
  let tmpRank = await db(
    connectionForPaint,
    R('anchor', ['rank'], ['anchorID'], [anchorID])
  )
  tmpRank = tmpRank[0].rank
  if (tmpRank) {
    tmpRank = JSON.parse(tmpRank)
    return {
      code: 2000,
      msg: ``,
      tmp: tmpRank
    }
  }

  let tmpAnchorPath = await db(
    connectionForPaint,
    R('anchor', ['curPath'], ['anchorID'], [anchorID])
  )
  let anchorPath = tmpAnchorPath[0].curPath
  anchorPath = anchorPath.substring(1, anchorPath.length - 1)
  anchorPath = JSON.parse(anchorPath)

  let anchorX = []
  let anchorY = []
  anchorPath.forEach(e => {
    anchorX.push(e.x)
    anchorY.push(e.y)
  })

  let tmpAudiencePath = await db(
    connectionForPaint,
    R('audience', ['allPath'], ['anchorID'], [anchorID])
  )

  let resultRank = []

  if (!tmpAudiencePath[0].allPath || tmpAudiencePath[0].allPath.length < 1) {
    return {
      code: 2009,
      msg: `用户数据为空`
    }
  }
  tmpAudiencePath = tmpAudiencePath[0].allPath.split(';')
  tmpAudiencePath.forEach(e => {
    let userX = []
    let userY = []

    e = JSON.parse(e)
    e.path.forEach(i => {
      userX.push(i.x)
      userY.push(i.y)
    })
    let dis = distance(anchorX, anchorY, userX, userY, 152)
    let obj = {
      id: e.id,
      name: e.name,
      avatar: e.avatar,
      path: e.path,
      dis
    }
    resultRank.push(obj)
  })

  resultRank.sort((a, b) => {
    return a.dis - b.dis
  })

  resultRank = JSON.stringify(resultRank)
  await db(
    connectionForPaint,
    U('anchor', ['rank'], ['anchorID'], [resultRank, anchorID])
  )

  let tmp = await db(
    connectionForPaint,
    R('anchor', ['rank'], ['anchorID'], [anchorID])
  )
  tmp = tmp[0].rank
  tmp = JSON.parse(tmp)
  return {
    code: 2000,
    msg: `排序完成`,
    tmp
  }
}

// 主播点击结束两端 rank / 或者关闭进来游戏未结束
const getRankController = async ({ identify, anchorID, id }) => {
  let Uresult = await db(
    connectionForPaint,
    R('anchor', ['rank', 'curPath'], ['anchorID'], [anchorID])
  )

  let lenC = Uresult[0].curPath.length

  if (!Uresult[0].rank || Uresult[0].rank.length < 1) {
    return {
      code: 2009,
      msg: '无排名结果'
    }
  }

  if (identify === 'U') {
    rank = JSON.parse(Uresult[0].rank)
    rank = toOne(rank)
    return {
      rank,
      anchorPath: JSON.parse(Uresult[0].curPath.substring(1, lenC - 1))
    }
  } else {
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
    let rank = JSON.parse(Uresult[0].rank)
    let myRank
    rank.forEach((e, idx) => {
      if (e.id === id) {
        myRank = idx + 1
      }
    })
    rank = toOne(rank)
    if (selfPath) {
      return {
        rank,
        anchorPath: JSON.parse(Uresult[0].curPath.substring(1, lenC - 1)),
        selfPath,
        myRank
      }
    } else {
      return {
        anchorPath: result[0].curPath,
        msg: '用户还没绘制'
      }
    }
  }
}

// 用户是否可以开始绘画
const canPaintController = async ({ anchorID }) => {
  let result = await db(
    connectionForPaint,
    R('anchor', ['gameTime'], ['anchorID'], [anchorID])
  )

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
  getSimilarityController
}
