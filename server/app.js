const Koa = require('koa');
const staticServ = require('./static');
const bodyParser = require('koa-bodyparser');

let config = require('./config');
let router = require('./router');

const app = new Koa();

app.use(staticServ);

app.use(bodyParser());
app.use(router.routes());

app.listen(config.port);
console.log(`Listening on port ${config.port}`);

