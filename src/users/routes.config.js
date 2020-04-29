const express = require('express');
const UserController = require('./UserController');
const VerifyMiddleware = require('../auth/verify.middleware');
const ValidationMiddleware = require('../common/verify.middleware');
const HasPerm = require('../common/Permission');

exports.Route = function(app){

  app.post('/users',[
    VerifyMiddleware.HasValidFields,
    UserController.insert
  ]);

  app.get('/users/:user_id', [
    ValidationMiddleware.JWTneeded,
    UserController.find
  ]);

  app.patch('/users/:user_id', [
    ValidationMiddleware.JWTneeded,
    HasPerm.CanEdit,
    UserController.edit
  ]);

  app.delete('/users/:user_id', [
    ValidationMiddleware.JWTneeded,
    HasPerm.CanEdit,
    UserController.delete
  ]);

    app.get('/users/search/:username', UserController.findbyname);
}
