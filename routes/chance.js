const router = require('koa-router')()
const _ = require('../controllers/chance')
const decode = require('../tools/huya-ext/decode.js')

router.prefix('/chance')

// 判断主播进入小程序的状态，是否没结束上一次的游戏
router.get('/status', async ctx => {
  let { profileId } = decode()
  let anchorID = profileId
  let result = await _.statusController(anchorID)

  ctx.body = result
})

// 主播点击开始/结束小程序
router.get('/start2close', async ctx => {
  let { profileId } = decode()
  let anchorID = profileId
  const { status } = ctx.query

  await _.startOrCloseController({ anchorID, status })

  ctx.body = {
    code: 200,
    msg: `主播${Number(status) ? '开始' : '结束'}小程序`
  }
})

// 主播获取默认值
router.get('/getDefault', async ctx => {
  let { profileId } = decode()
  let anchorID = profileId
  let result = await _.getDefaultItemController({ anchorID })
  ctx.body = result
})

// 主播设置默认值
router.post('/setItems', async ctx => {
  let { profileId } = decode()
  let anchorID = profileId
  const { items } = ctx.request.body
  let result = await _.setDefaultItemController({ anchorID, items })
  ctx.body = result
})

// 设置成功或失败
router.post('/setSuccessOrFail', async ctx => {
  let { profileId } = decode()
  let anchorID = profileId
  const { success, fail } = ctx.request.body
  let result = await _.setSuccessController({ success, anchorID, fail })
  ctx.body = result
})

// 获取成功或失败
router.get('/getSuccessOrFail', async ctx => {
  let { profileId } = decode()
  let anchorID = profileId
  let result = await _.getSuccessController({ anchorID })
  ctx.body = result
})

// 主播设置时间阶段
router.post('/setTick', async ctx => {
  let { profileId } = decode()
  let anchorID = profileId
  const { time, tick, tickStatus } = ctx.request.body
  let result = await _.setTickController({ anchorID, time, tick, tickStatus })
  ctx.body = result
})

// 用户获取时间阶段
router.get('/getTick', async ctx => {
  let { profileId } = decode()
  let anchorID = profileId
  let result = await _.getTickController({ anchorID })
  ctx.body = result
})

// 用户加入游戏
router.get('/takeParkIn', async ctx => {
  let { profileId } = decode()
  let anchorID = profileId
  const { id } = ctx.query
  let result = await _.takeParkInController({ anchorID, id })
  ctx.body = result
})

// 用户提交挑战
router.post('/saveChance', async ctx => {
  let { profileId } = decode()
  let anchorID = profileId
  const { chance, id, name, avatar } = ctx.request.body
  let result = await _.saveChanceController({
    anchorID,
    chance,
    id,
    name,
    avatar
  })
  ctx.body = result
})

// 随机获取观众留言
router.get('/getChance', async ctx => {
  let { profileId } = decode()
  let anchorID = profileId
  let result = await _.getChanceController({ anchorID })
  ctx.body = result
})

// 主播选择三个选项
router.post('/setVotes', async ctx => {
  let { profileId } = decode()
  let anchorID = profileId
  const { items } = ctx.request.body
  let result = await _.setVotesController({ anchorID, items })
  ctx.body = result
})

// 获取用户投票选项
router.get('/getVotes', async ctx => {
  let { profileId } = decode()
  let anchorID = profileId
  let result = await _.getVotesController({ anchorID })
  ctx.body = result
})

// 获取用户投票最后的结果
router.get('/getVotesResult', async ctx => {
  let { profileId } = decode()
  let anchorID = profileId
  let result = await _.getVotesResultController({ anchorID })
  ctx.body = result
})

// 用户投票
router.post('/voteItems', async ctx => {
  const { voteID, id } = ctx.request.body
  let { profileId } = decode()
  let anchorID = profileId
  let result = await _.voteItemsController({ anchorID, voteID, id })
  ctx.body = result
})

// 用户选择主播成功失败
router.post('/voteSuccessOrFail', async ctx => {
  const { lastStatus, id } = ctx.request.body
  let { profileId } = decode()
  let anchorID = profileId
  let result = await _.lastStatusController({ anchorID, lastStatus, id })
  ctx.body = result
})

// 返回主播成功失败
router.get('/result', async ctx => {
  let { profileId } = decode()
  let anchorID = profileId
  let result = await _.returnResultController({ anchorID })
  ctx.body = result
})

module.exports = router
