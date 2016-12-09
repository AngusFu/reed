const path  = require('path');
const serve = require("koa-send");

module.exports = async(ctx, next) => {
  if (/^\/assets\//.test(ctx.path)) {
    await serve(ctx, ctx.path, {
      root: path.resolve(__dirname, '../www')
    });
  } else {
    await next();
  }
};
