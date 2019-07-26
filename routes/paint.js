const router = require('koa-router')();
const {
  statusController,
  startOrCloseController,
  savePathAnchorController,
  takeParkInController
} = require('../controllers/paint');

router.prefix('/paint');

// 判断主播进入小程序的状态，是否没结束上一次的游戏
router.get('/status', async ctx => {
  const { anchorID } = ctx.query;
  let result = await statusController(anchorID);
  let msg;
  switch (result.code) {
    case 2001: {
      msg = '主播第一次进入';
      break;
    }
    case 2002: {
      msg = '主播可以正常开始';
      break;
    }
    case 2003: {
      msg = '主播上次游戏没结束';
      break;
    }
    default:
      "I'm OK";
  }

  let bodyMsg = {
    code: result.code,
    msg
  };

  if (result.code === 2003) {
    bodyMsg.time = result.time;
  }

  ctx.body = bodyMsg;
});

// 主播点击开始/结束小程序
router.get('/start2close', async ctx => {
  const { anchorID, status, time } = ctx.query;
  await startOrCloseController({ anchorID, status, time });

  ctx.body = {
    code: 200,
    msg: `主播${Number(status) ? '开始' : '结束'}小程序`
  };
});

// 主播绘制作品
router.post('/startPaintAnchor', async ctx => {
  const { anchorID, path } = ctx.request.body;
  try {
    await savePathAnchorController({ anchorID, path });
    ctx.body = {
      code: 200,
      msg: '主播绘制成功'
    };
  } catch (error) {
    ctx.body = {
      code: 510,
      msg: `主播还没开始小程序`
    };
  }
});

// 观众加入小程序
router.get('/takeParkIn', async ctx => {
  const { anchorID, id } = ctx.query;
  await takeParkInController({ anchorID, id });
  ctx.body = {
    code: 200,
    msg: '用户参与游戏成功'
  };
});

module.exports = router;
