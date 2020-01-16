const crypto = require('crypto');
const db = require('../users/UserDb');

exports.HasValidFields = (req, res, next) =>{
  let errors = [];
  if(req.body){

    if(!req.body.user && !req.body.email){
      errors.push('Missing Username ');
      errors.push('Missing Email ');
    }

    if(!req.body.password)
      errors.push('Missing Password');

    if(errors.length)
      res.status(400).send({errors: errors.join(',')});
    else
      return next();
  }
  else
    res.status(200).send({errors: 'Missing Email and Password'});
}

exports.UserExists = (req, res, next) =>{
  if(req.body.email)
    db.FindbyEmail(req.body.email).then(user => {
      if(!user)
        res.status(404).send({errors: 'User Not Found'});
      else{
        let passwordSplit = user.fields.pass.split('$');
        let salt = passwordSplit[0];
        let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest('base64');
        if(hash === passwordSplit[1]){
          req.body = {
            user_id: user.id,
            user: user.fields.user,
            email: user.fields.email,
            password: user.fields.pass
          };
          return next();
        }
        else
          return res.status(400).send({errors: 'Invalid Email or Password'});
      }
    }).catch((errors) => { res.status(404).send({errors}); });
  else if(req.body.user)
    db.FindbyUsername(req.body.user).then(user => {
      if(!user)
        res.status(404).send({errors: 'User Not Found'});
      else{
        let passwordSplit = user.fields.pass.split('$');
        let salt = passwordSplit[0];
        let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest('base64');
        if(hash === passwordSplit[1]){
          req.body = {
            user_id: user.id,
            user: user.fields.user,
            email: user.fields.email,
            password: user.fields.pass
          };
          return next();
        }
        else
          return res.status(400).send({errors: 'Invalid Email or Password'});
      }
    }).catch((errors) => { res.status(404).send({errors}); });
}
