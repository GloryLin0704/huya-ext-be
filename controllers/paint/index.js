const { connectionForPaint, db } = require('../../tools/mysql/index');
const { C, R, U, D } = require('../../tools/mysql/sql');

// 判断主播进入小程序的状态，是否没结束上一次的游戏
const statusController = async anchorID => {
  let result = await db(
    connectionForPaint,
    R('anchor', ['*'], ['anchorID'], [anchorID])
  );
  console.log(result);
  if (result.length) {
    if (!Number(result[0].status)) {
      return {
        code: 2002
      };
    } else {
      return {
        code: 2003,
        time: result[0].time
      };
    }
  } else {
    return {
      code: 2001
    };
  }
};

// 主播点击开始/结束小程序
const startOrCloseController = async obj => {
  let { anchorID, status, time } = obj;
  let result = await db(
    connectionForPaint,
    R('anchor', ['*'], ['anchorID'], [anchorID])
  );

  return result.length
    ? db(
        connectionForPaint,
        U('anchor', ['status', 'time'], ['anchorID'], [status, time, anchorID])
      )
    : db(
        connectionForPaint,
        C('anchor', ['anchorID', 'status', 'time'], [anchorID, status, time])
      );
};

// 主播绘制作品
const savePathAnchorController = async obj => {
  let { anchorID, path } = obj;
  let result = await db(
    connectionForPaint,
    R('anchor', ['status'], ['anchorID'], [anchorID])
  );

  if (Number(result[0].status)) {
    return db(
      connectionForPaint,
      U('anchor', ['curPath'], ['anchorID'], [path, anchorID])
    );
  } else {
    throw new Error();
  }
};

// 观众加入小程序
const takeParkInController = async obj => {
  let { anchorID, id } = obj;
  let result = await db(
    connectionForPaint,
    R('audience', ['*'], ['anchorID'], [anchorID])
  );

  if (result.length) {
    console.log(result);
    let ids = result[0].allAudience;
    ids = [].concat(ids, id);
    return db(
      connectionForPaint,
      U('audience', ['allAudience'], ['anchorID'], [ids, anchorID])
    );
  } else {
    let audience = [id];
    return db(
      connectionForPaint,
      C('audience', ['anchorID', 'allAudience'], [anchorID, audience])
    );
  }
};

module.exports = {
  statusController,
  startOrCloseController,
  savePathAnchorController,
  takeParkInController
};

// db(connectionForChange, D('tables', ['name', 'cardId'], ['Li', 12312123]))
