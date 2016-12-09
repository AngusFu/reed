'use strict';
let path = require('path');
let environment = process.env.NODE_ENV || 'production';

let localStaticPath = '../dist';

module.exports = {
  env: environment,
  port: process.env.PORT || 9000,
  staticPath: path.resolve(__dirname, localStaticPath),
  jwt_secret: process.env.JWT_SECRET || 'angular2-secret',

  github_auth: {
    client_id: "aeeae6a56f318481f9e4",
    client_secret: "86f023bb9998e06a203373dc684b5aee2bd6cccb"
  },

  white_list: [
    "webzhao",
    "AngusFu",
    "zhouweicsu"
  ],

  mysql: {
    host: 'localhost',
    port: '3306',
    database: 'weekly_75team_com',
    user: 'root',
    password: ''
  }
};
