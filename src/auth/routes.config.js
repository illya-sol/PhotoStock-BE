const VerifyMiddleware = require('./verify.middleware');
const AuthController = require('./auth.controller');
const VerifyTokenMiddleware = require('../common/verify.middleware');

exports.Route = function(app){
  app.post('/auth',[
    VerifyMiddleware.HasValidFields,
    VerifyMiddleware.UserExists,
    AuthController.login
  ]);

  app.post('/auth/refresh',[
    VerifyTokenMiddleware.JWTneeded,
    VerifyTokenMiddleware.VerifyBodyRefresh,
    VerifyTokenMiddleware.ValidRefresh,
    AuthController.login
  ]);
}
