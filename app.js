const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const fs = require('fs')
const path = require('path')
const router  = new Router();
const WhiteList = ['/login', '/register'];
const koaBody = require('koa-body');
const koaJsonLogger = require('koa-json-logger');
const static = require('koa-static');
const cors = require('koa2-cors');
router.post('/uploadfile', async (ctx, next) => {
  // 上传单个文件
  
  const file = ctx.request.files.file; // 获取上传文件
  // 创建可读流
  console.log(ctx.request.files)
  const reader = fs.createReadStream(file.path);
  let filePath = path.join(__dirname, 'public/upload/') + `/${file.name}`;
  // 创建可写流
  console.log(filePath)
  const upStream = fs.createWriteStream(filePath);
  // 可读流通过管道写入可写流
  reader.pipe(upStream);
  console.log('上传成功！')
  return ctx.body = "上传成功！";
});
router.get('/', async (ctx, next) => {
 
  return ctx.body = "快去上传文件吧！";
});

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
console.log(__dirname+'./public')
app.use(static(__dirname+'/public'));

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