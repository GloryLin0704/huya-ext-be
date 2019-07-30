const router = require('koa-router')()
const _ = require('../controllers/chance')

router.prefix('/chance')

// 判断主播进入小程序的状态，是否没结束上一次的游戏
router.get('/status', async ctx => {
  const { anchorID } = ctx.query
  console.log(ctx)
  let result = await _.statusController(anchorID)

  ctx.body = result
})

// 主播点击开始/结束小程序
router.get('/start2close', async ctx => {
  const { anchorID, status, time } = ctx.query
  await _.startOrCloseController({ anchorID, status, time })

  ctx.body = {
    code: 200,
    msg: `主播${Number(status) ? '开始' : '结束'}小程序`
  }
})

// 主播获取默认值
router.get('/getDefault', async ctx => {
  const { anchorID } = ctx.query
  let result = await _.getDefaultItemController({ anchorID })
  ctx.body = result
})

// 主播设置默认值
router.post('/setItems', async ctx => {
  const { anchorID, items } = ctx.request.body
  let result = await _.setDefaultItemController({ anchorID, items })
  ctx.body = result
})

// 设置成功奖励
router.post('/setSuccess', async ctx => {
  const { success, anchorID } = ctx.request.body
  let result = await _.setSuccessController({ success, anchorID })
  ctx.body = result
})

// 获取成功奖励
router.get('/getSuccess', async ctx => {
  const { anchorID } = ctx.query
  let result = await _.getSuccessController({ anchorID })
  ctx.body = result
})

// 设置失败惩罚
router.post('/setFail', async ctx => {
  const { fail, anchorID } = ctx.request.body
  let result = await _.setFailController({ fail, anchorID })
  ctx.body = result
})

// 获取失败惩罚
router.get('/getFail', async ctx => {
  const { anchorID } = ctx.query
  let result = await _.getFailController({ anchorID })
  ctx.body = result
})

// 用户加入游戏
router.get('/takeParkIn', async ctx => {
  const { anchorID, id } = ctx.query
  let result = await _.takeParkInController({ anchorID, id })
  ctx.body = result
})

// 用户提交挑战
router.post('/saveChance', async ctx => {
  const { anchorID, chance, id } = ctx.request.body
  let result = await _.saveChanceController({ anchorID, chance, id })
  ctx.body = result
})

// 随机获取观众留言
router.get('/getChance', async ctx => {
  const { anchorID } = ctx.query
  let result = await _.getChanceController({ anchorID })
  ctx.body = result
})

// 主播选择三个选项
router.post('/setVotes', async ctx => {
  const { anchorID, items } = ctx.request.body
  let result = await _.setVotesController({ anchorID, items })
  ctx.body = result
})

module.exports = router
