const express = require('express');

const ValidationMiddleware = require('../common/verify.middleware');
const UnsplashController = require('./UnsplashController');

exports.Route = function(app){

  app.get('/unsplash/start', [
    UnsplashController.startPage
  ]);

  app.get('/unsplash/Random', [
    ValidationMiddleware.JWTneeded,
    UnsplashController.Random
  ]);

  app.get('/unsplash/:keyword', [
    ValidationMiddleware.JWTneeded,
    UnsplashController.SearchPhotos
  ]);

  app.get('/unsplash', [
    ValidationMiddleware.JWTneeded,
    UnsplashController.listPhotos
  ]);

}
