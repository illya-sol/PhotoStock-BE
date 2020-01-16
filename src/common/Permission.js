const jwt = require('jsonwebtoken');

exports.CanEdit = (req, res, next) => {
  if(req.params && req.params.user_id && req.params.user_id === req.jwt.user_id)
    return next();
  else
    return res.sendStatus(403);
}
