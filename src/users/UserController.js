const db = require('./UserDb');
const crypto = require('crypto');
const uuid4 = require('uuid/v4');

exports.insert = (req, res) =>{
    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest('base64');

    req.body.password = salt + '$' + hash;
    req.body.user_id = uuid4();

    db.CreateUser(req.body).then((result)=>{
      res.status(201).send({id: result});
    }).catch(err => { res.status(400).send({errors: '' + err})});
}

exports.find = (req, res) =>{
    db.FindById(req.params.user_id).then((result) => {res.status(201).send(result.fields);} )
    .catch((error) => { res.status(404).send({errors: '' + error}); });
}

exports.edit = (req, res) =>{
    req.body.user_id = req.params.user_id;
    db.Edit(req.body).then(() => {res.sendStatus(201);} )
    .catch((error) => { res.status(404).send({errors: '' + error}); });
}

exports.delete = (req, res) =>{
    db.DeleteById(req.params.user_id).then(() => {res.sendStatus(200);} )
    .catch((error) => { res.status(406).send({errors: '' + error}); });
}
