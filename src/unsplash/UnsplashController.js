const Splash = require('unsplash-js').default;
const toJson = require('unsplash-js').toJson;
const util = require('util');

global.fetch = require('node-fetch');

const config = require('../env.conf');

const unsplash = new Splash({
    accessKey: config.uAccess,
    secret: config.uSecret
});

exports.Random = (req, res) =>{
  new Promise((resolve, reject) => {
    unsplash.photos.getRandomPhoto().then(toJson).then(json => {
      return resolve(res.status(201).send({photos: json}));
    }).catch((err) => {
      return reject(res.status(401).send({err}));
    });
  });
}

exports.listPhotos = (req, res) =>{
  new Promise((resolve, reject) => {
    unsplash.photos.listPhotos(req.query.page, req.query.per_page, req.query.order).then(toJson).then(json => {
      return resolve(res.status(201).send({photos: json}));
    }).catch((err) => {
      return reject(res.status(401).send({err}));
    });
  });
}

exports.startPage = (req, res) =>{
  new Promise((resolve, reject) => {
    unsplash.photos.listPhotos(1, 30).then(toJson).then(json => {
      return resolve(res.status(201).send({photos: json}));
    }).catch((err) => {
      return reject(res.status(401).send({err}));
    });
  });
}

exports.SearchPhotos = async (req, res) =>{
    console.log(req.query)
  await unsplash.search.photos(req.params.keyword, req.query.page, req.query.per_page).then(toJson).then(json => {
      res.status(201).send({photos: json})
    }).catch((err) => {
      res.status(401).send({err})
    });
}
