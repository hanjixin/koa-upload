const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');

const router  = new Router();
const WhiteList = ['/login', '/register'];
const koaBody = require('koa-body');
const koaJsonLogger = require('koa-json-logger');
const static = require('koa-static');
const cors = require('koa2-cors');

app.use(async (ctx, next) => {
  const start = Date.now();
  await next().catch((err) => {
    if (401 == err.status) {
        ctx.status = 401;
        ctx.body = 'Protected resource, use Authorization header to get access\n';
    } else {
        throw err;
    }
});
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
})

app.use(cors())
app.use(static(__dirname+'./public'));

app.use(koaJsonLogger());
app.use(koaBody({
  multipart: true,
  formidable: {
      maxFileSize: 2000*1024*1024    // 设置上传文件大小最大限制，默认2M
  }
}));
app.use(router.routes())
app.use(router.allowedMethods())
app.listen(9009, () => {
  console.log('server is listen port ' + 9009)
})