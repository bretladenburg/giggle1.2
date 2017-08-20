'use strict';

const Router = require('express').Router;
const debug = require('debug')('giggle: User Router');
const createError = require('http-errors');
const jasonParser = require('body-parser').json();

const User = require('../model/user');
const basicAuth = require('../lib/basic.js');

const userRouter = module.exports = new Router();

userRouter.post('/api/signup', jasonParser, function(req, res, next) {
  debug('POST /api/signup');

  if(!req.body.userName) return next(createError(400, 'Username required'));
  if(!req.body.passWord) return next(createError(400, 'Password required'));

  let passWord = req.body.passWord;
  delete req.body.passWord;

  let newUser = new User(req.body);
  newUser.encryptPassword(passWord)
  .then(user => user.generateToken())
  .then(token => res.json(token))
  .catch(err => next(createError(400, err.message)));

});

userRouter.get('/api.login', basicAuth, function(req, res, next) {
  debug('GET /api/login');
});
