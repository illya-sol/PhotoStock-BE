const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const jwtSecret = require('../env.conf').jwt_secret;

exports.login = (req, res) =>{
  try{
    let refreshId = req.body.user_id + jwtSecret;
    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512', salt).update(refreshId).digest('base64');

    req.body.refreshKey = salt;

    let token = jwt.sign(req.body, jwtSecret);
    let buffer = Buffer.from(hash);

    let reftoken = buffer.toString('base64');
    res.status(201).send({user_id: req.body.user_id, refreshToken: reftoken, accessToken: token});
  }
  catch(err){
    res.status(500).send({errors: err});
  }
}

exports.refresh = (req, res) => {
  try{
    req.body = req.jwt;
    let token = jwt.sign(req.body, jwtSecret);
    res.status(201).send({id: token});
  }
  catch(err){
    res.status(500).send({errors: err});
  }
}
