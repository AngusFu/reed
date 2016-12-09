'use strict';

const jwt = require('jsonwebtoken');
const config = require('./config');
const WHITE_LIST  = config['white_list'];
const GITHUB_AUTH = config['github_auth'];

// @see https://developer.github.com/v3/oauth/#web-application-flow
const LOGIN_URL = 'https://github.com/login/oauth/authorize?' + require('querystring').stringify({
  client_id: GITHUB_AUTH['client_id'],
  redirect_uri: 'http://localhost:9000/redirect',
  state: 'github',
  allow_signup: false
});

const JWT_SECRET  = config['jwt_secret'];
// generate jwt
const signJWT = (params = {}, opts = {}) => jwt.sign(params, JWT_SECRET, opts);
const jwtMiddleware = require('koa-jwt')({ secret: JWT_SECRET });

const request = require('request-promise');
const router  = require('koa-router')();
// 连接数据库
const sqlConn = require('./db');

let posts = [{
  _id: Math.random(),
  name: 'Angular',
  website: 'https://angular.io/',
  description: 'Angular is a development platform for building mobile and desktop web applications.'
}, {
  _id: Math.random(),
  name: 'RxJs',
  website: 'http://reactivex.io/',
  description: 'Reactive Extensions (Rx) is a library for composing asynchronous and event-based programs using observable sequences and LINQ-style query operators.'
}, {
  _id: Math.random(),
  name: 'Babel',
  website: 'https://babeljs.io/',
  description: 'Babel is a compiler for writing next generation JavaScript.'
}];

function findPost(id) {
  return posts.find((post) => {
    return post._id == id;
  });
}

router.get('/posts', function (ctx) {
  ctx.body = posts;
});

router.get('/post/:id', function (ctx) {
  let foundPost = findPost(ctx.params.id);

  if (foundPost) {
    ctx.body = foundPost;
  } else {
    ctx.throw(404);
  }
});

router.post('/post/:id', function (ctx) {
  let foundPost = findPost(ctx.params.id);

  if (foundPost) {
    Object.assign(foundPost, ctx.request.body);
    ctx.body = foundPost;
  } else {
    ctx.throw(404);
  }
});


router.post('/post', jwtMiddleware, function (ctx) {
  // posts.unshift(Object.assign({},
  //   ctx.request.body, {
  //     _id: Math.random()
  //   }
  // ));
  console.log(ctx.state)
  ctx.body = {
    success: true
  };
});

// router.post('/login', function (ctx) {
//   let email = ctx.request.body.email;
//   let password = ctx.request.body.password;

//   let result = {
//     success: false
//   };

//   if (email == 'admin@gmail.com' && password == 'angular2') {
//     result.success = true;
//     result.auth_token =
//   }

//   ctx.body = result;
// });


/**
 * Github 登录确认后重定向
 * 根据重定向参数 获取用户信息
 */
const getUserInfo = async function ({ code, state }) {
  if (!state || !code) {
    return null;
  }

  let {
    client_id,
    client_secret,
    auth_people
  } = GITHUB_AUTH;

  try {

    let { access_token } = await request({
      url: 'https://github.com/login/oauth/access_token',
      qs: {
        client_id,
        client_secret,
        code,
        redirect_uri: 'http://localhost:9000/test',
        state
      },
      method: 'post',
      json: true
    });

    let userInfo = await request({
      method: 'get',
      url: `https://api.github.com/user`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36',
        Authorization: `token ${access_token}`
      },
      json: true
    });

    return userInfo;
  } catch (e) {
    return null;;
  }
};

router.get('/redirect', async function (ctx) {
  let { code, state } = ctx.query;
  let userInfo = await getUserInfo({ code, state });
  let userName = userInfo && userInfo.login;

  // when error occurs
  if (!userName) {
    ctx.body = {
      success: false,
      message: 'Error!'
    };
    return;
  }

  // not authorized
  if (!WHITE_LIST.includes(userName)) {
    ctx.body = {
      success: false,
      message: 'You are not authorized yet!'
    };
    return;
  }

  let auth_token = signJWT({ userName: userInfo.login }, { expiresIn: 20*100 });

  ctx.body = {
    success: true,
    userName: userInfo.login,
    userAvatar: userInfo.avatar_url,
    authToken: auth_token
  };

});

// TODO
// 提供登录弹出页
// 完成确认之后
router.get('/login', function (ctx) {
  ctx.res.type = 'text/html';
  ctx.body = '<a href="' + LOGIN_URL +'">Login With Github</a>';
});

// loginWithGithub: function() {
//   var windowObjectReference = null,
//       oAuthURL = "https://github.com/login/oauth/authorize?client_id=b9c43dc2e807f3b31c38&state=github&redirect_uri=http%3a%2f%2fgold.xitu.io%2foauth%2flogin";
//   if (null == windowObjectReference || windowObjectReference.closed) {
//       window.open(oAuthURL, "_blank", "toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, width=800, height=600")
//   } else windowObjectReference.focus()
// }

module.exports = router;
