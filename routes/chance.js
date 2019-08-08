const router = require('koa-router')()
const _ = require('../controllers/chance')
const decode = require('../tools/huya-ext/decode.js')

router.prefix('/chance')

// 判断主播进入小程序的状态，是否没结束上一次的游戏
router.get('/status', async ctx => {
  let { profileId } = decode(ctx.header.authorization, 1)
  let anchorID = profileId
  let result = await _.statusController(anchorID)

  ctx.body = result
})

// 主播点击开始/结束小程序
router.get('/start2close', async ctx => {
  let { profileId } = decode(ctx.header.authorization, 1)
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
  let { profileId } = decode(ctx.header.authorization, 1)
  let anchorID = profileId
  let result = await _.getDefaultItemController({ anchorID })
  ctx.body = result
})

// 主播设置默认值
router.post('/setItems', async ctx => {
  let { profileId } = decode(ctx.header.authorization, 1)
  let anchorID = profileId
  const { items } = ctx.request.body
  let result = await _.setDefaultItemController({ anchorID, items })
  ctx.body = result
})

// 设置成功或失败
router.post('/setSuccessOrFail', async ctx => {
  let { profileId } = decode(ctx.header.authorization, 1)
  let anchorID = profileId
  const { success, fail } = ctx.request.body
  let result = await _.setSuccessController({ success, anchorID, fail })
  ctx.body = result
})

// 主播获取成功或失败
router.get('/getSuccessOrFail', async ctx => {
  let { profileId } = decode(ctx.header.authorization, 1)
  let anchorID = profileId
  let result = await _.getSuccessController({ anchorID })
  ctx.body = result
})

// 用户获取成功失败
router.get('/getSuccessAndFail', async ctx => {
  let { profileId } = decode(ctx.header.authorization, 1)
  let anchorID = profileId
  let result = await _.getSuccessResultController({ anchorID })
  ctx.body = result
})

// 主播设置时间阶段
router.post('/setTick', async ctx => {
  let { profileId } = decode(ctx.header.authorization, 1)
  let anchorID = profileId
  const { time, tick, tickStatus } = ctx.request.body
  let result = await _.setTickController({ anchorID, time, tick, tickStatus })
  ctx.body = result
})

// 用户获取时间阶段
router.get('/getTick', async ctx => {
  let { profileId } = decode(ctx.header.authorization, 1)
  let anchorID = profileId
  let result = await _.getTickController({ anchorID })
  ctx.body = result
})

// 用户加入游戏
router.get('/takeParkIn', async ctx => {
  let { profileId, userId } = decode(ctx.header.authorization, 1)
  let anchorID = profileId
  let id = userId
	let result = await _.takeParkInController({ anchorID, id })
	console.log('123',result)
  ctx.body = result
})

// 用户提交挑战
router.post('/saveChance', async ctx => {
  let { profileId, userId } = decode(ctx.header.authorization, 1)
  let anchorID = profileId
  let id = userId
  const { chance, name, avatar } = ctx.request.body
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
  let { profileId } = decode(ctx.header.authorization, 1)
  let anchorID = profileId
	let result = await _.getChanceController({ anchorID })
	console.log(result)
  ctx.body = result
})

// 主播选择三个选项
router.post('/setVotes', async ctx => {
  let { profileId } = decode(ctx.header.authorization, 1)
  let anchorID = profileId
  const { items } = ctx.request.body
  let result = await _.setVotesController({ anchorID, items })
  ctx.body = result
})

// 获取用户投票选项
router.get('/getVotes', async ctx => {
  let { profileId } = decode(ctx.header.authorization, 1)
  let anchorID = profileId
  let result = await _.getVotesController({ anchorID })
  ctx.body = result
})

// 获取用户投票最后的结果
router.get('/getVotesResult', async ctx => {
  let { profileId } = decode(ctx.header.authorization, 1)
  let anchorID = profileId
  let result = await _.getVotesResultController({ anchorID })
  ctx.body = result
})

// 用户投票(三选一)
router.post('/voteItems', async ctx => {
  const { voteID } = ctx.request.body
  let { profileId, userId } = decode(ctx.header.authorization, 1)
  let anchorID = profileId
  let id = userId
  let result = await _.voteItemsController({ anchorID, voteID, id })
  ctx.body = result
})

// 用户选择主播成功失败
router.post('/voteSuccessOrFail', async ctx => {
  const { voteStatus } = ctx.request.body
  let { profileId, userId } = decode(ctx.header.authorization, 1)
  let anchorID = profileId
  let id = userId
	let result = await _.voteStatusController({ anchorID, voteStatus, id })
  ctx.body = result
})

// 返回主播成功失败投票数
router.get('/result', async ctx => {
  let { profileId } = decode(ctx.header.authorization, 1)
  let anchorID = profileId
  let result = await _.returnVotesController({ anchorID })
  ctx.body = result
})

// 返回主播挑战结果
router.get('/getLastStatus', async ctx => {
  let { profileId } = decode(ctx.header.authorization, 1)
  let anchorID = profileId
  let result = await _.returnResultController({ anchorID })
  ctx.body = result
})

// 主播接受或者拒绝挑战
router.get('/recOrRej', async ctx => {
  const { chanceStatus } = ctx.query
  let { profileId } = decode(ctx.header.authorization, 1)
  let anchorID = profileId
  let result = await _.recOrRejController({ anchorID, chanceStatus })
  ctx.body = result
})

// 用户查询主播是接受还是拒绝挑战
router.get('/getRecOrRej', async ctx => {
  let { profileId } = decode(ctx.header.authorization, 1)
  let anchorID = profileId
  let result = await _.getRecOrRejController({ anchorID })
  ctx.body = result
})

module.exports = router
