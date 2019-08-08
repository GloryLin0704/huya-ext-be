const router = require('koa-router')()
const decode = require('../tools/huya-ext/decode.js')
const {
  statusController,
  startOrCloseController,
  savePathAnchorController,
  takeParkInController,
  savePaintAudienceController,
  getRankController,
  canPaintController,
  getStartTimeController,
  getSimilarityController
} = require('../controllers/paint')

router.prefix('/paint')

// 判断主播进入小程序的状态，是否没结束上一次的游戏
router.get('/status', async ctx => {
  let { profileId, info } = decode(ctx.header.authorization, 0)
  let anchorID = profileId
  let result = await statusController(anchorID)
  let msg
  switch (result.code) {
    case 2001: {
      msg = '主播第一次进入'
      break
    }
    case 2002: {
      msg = '主播可以正常开始'
      break
    }
    case 2003: {
      msg = '主播上次游戏没结束'
      break
    }
    default:
      "I'm OK"
  }

  let bodyMsg = {
    code: result.code,
    msg
  }

  if (result.code === 2003) {
    bodyMsg.time = result.time
  }

  ctx.body = bodyMsg
})

// 主播点击开始/结束小程序
router.get('/start2close', async ctx => {
  const { status, time } = ctx.query
  let { profileId } =  decode(ctx.header.authorization, 0)
  let anchorID = profileId
  await startOrCloseController({ anchorID, status, time })

  ctx.body = {
    code: 200,
    msg: `主播${Number(status) ? '开始' : '结束'}小程序`
  }
})

// 观众加入小程序
router.get('/takeParkIn', async ctx => {
  let { profileId, userId, info } = decode(ctx.header.authorization, 0)
  let anchorID = profileId
  let id = userId
  let result = await takeParkInController({ anchorID, id })
  ctx.body = result
})

// 获取时间
router.get('/getStartTime', async ctx => {
  let { profileId } =  decode(ctx.header.authorization, 0)
  let anchorID = profileId
  let result = await getStartTimeController({ anchorID })
  ctx.body = result
})

// 主播绘制作品
router.post('/startPaintAnchor', async ctx => {
  const { path } = ctx.request.body
  let { profileId } =  decode(ctx.header.authorization, 0)
  let anchorID = profileId
  try {
    let result = await savePathAnchorController({ anchorID, path })
    ctx.body = result
  } catch (error) {
    ctx.body = {
      code: 2006,
      msg: `主播还没开始小程序`
    }
  }
})

// 观众绘制作品
router.post('/startPaintAudience', async ctx => {
  const { path, name, avatar } = ctx.request.body
  let { profileId, userId } =  decode(ctx.header.authorization, 0)
  let anchorID = profileId
  let id = userId
  let result = await savePaintAudienceController({
    path,
    anchorID,
    id,
    name,
    avatar
  })
  ctx.body = result
})

// 进行排名
router.get('/toGetSimilar', async ctx => {
  let { profileId } =  decode(ctx.header.authorization, 0)
  let anchorID = profileId
  let result = await getSimilarityController({ anchorID })
  ctx.body = result
})

// 游戏结束获取排名
router.get('/getRank', async ctx => {
  let { profileId, userId } =  decode(ctx.header.authorization, 0)
  let anchorID = profileId
  let id = userId
  const { identify } = ctx.query
  let result = await getRankController({ identify, anchorID, id })
  ctx.body = {
    code: 200,
    ...result
  }
})

// 用户重新进入
router.get('/againInto', async ctx => {
  let { profileId, userId } =  decode(ctx.header.authorization, 0)
  let anchorID = profileId
  let id = userId
  let result = await getRankController({ anchorID, id })
  ctx.body = {
    code: 200,
    ...result
  }
})

// 观众开始绘制
router.get('/canPaint', async ctx => {
  let { profileId } =  decode(ctx.header.authorization, 0)
  let anchorID = profileId
  let result = await canPaintController({ anchorID })
  ctx.body = {
    code: 200,
    ...result
  }
})

module.exports = router
