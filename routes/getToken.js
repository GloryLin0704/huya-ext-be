const router = require('koa-router')();

router.prefix('/');

router.get('/get', async ctx => {
    
    ctx.body = {
        code:200,
        result: ctx
    }    
})

module.exports = router;
