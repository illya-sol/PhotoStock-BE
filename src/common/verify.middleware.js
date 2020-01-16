const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const jwtSecret = require('../env.conf').jwt_secret;

exports.VerifyBodyRefresh = (req, res, next) => {
  if(req.body && req.body.refreshToken)
    return next();
  else
    res.sendStatus(403);
}

exports.ValidRefresh = (req, res, next) => {
  let buffer = Buffer.from(req.body.refreshToken, 'base64');

  let refresh_Token = buffer.toString();

  let hash = crypto.createHmac('sha512', req.jwt.refreshKey).update(req.jwt.user_id + jwtSecret).digest('base64');
  if(hash === refresh_Token){
    req.body = req.jwt;
    return next();
  }
  else
    return res.status(400).send({error: 'Invalid refresh token'});
}

exports.JWTneeded = (req, res, next) => {
    if(req.headers['authorization']){
      try{
        let auth = req.headers['authorization'].split(' ');
        if(auth[0] !== 'Bearer')
          return res.sendStatus(401);
        else{
          req.jwt = jwt.verify(auth[1], jwtSecret);
          return next();
        }
      }
      catch(err){
        return res.sendStatus(403);
      }
    }
    else
      return res.sendStatus(401);
}
