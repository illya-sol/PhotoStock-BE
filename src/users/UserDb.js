const airtable = require('airtable');
config = require('../env.conf');

var base = new airtable({apiKey: config.secreat_air}).base(config.db_base);

exports.CreateUser = (userData) =>{
  return new Promise((resolve,reject)=>{
    base('users').create({
          user_id: userData.user_id,
          user: userData.user,
          email: userData.email,
          pass: userData.password
      }, (err, record) => {
      if (err)
        return reject(err);
      return resolve(record.getId());
    });
  });
}

exports.Edit = function(user){
  return new Promise((resolve,reject)=>{
    base('users').update([{
        "id": user.user_id,
        "fields": {
          "user": user.user,
          "pass": user.pass,
          "email": user.email
    }}], function(err, records) {
      if (err)
        return reject(err);
      records.forEach(function(record) {
        return resolve();
      });
    });
  });
}

exports.DeleteById = function(user_id){
  return new Promise((resolve,reject)=>{
    base('users').destroy([user_id], function(err, deletedRecords) {
      if (err) {
        return reject(err);
        return;
      }
      return resolve('Deleted');
    });
  });
}

exports.FindById = function(userId){
  return new Promise((resolve,reject)=>{
    base('users').find(userId,(err, record)=>{
      if(err)
        return reject(err.message);
      return resolve(record);
    });
  });
}

exports.FindbyEmail = function(email){
  return new Promise((resolve,reject)=>{
    base('users').select({}).eachPage(function page(records, fetchNextPage){
      records.forEach((record) => {
        if(email === record.get('email'))
          return resolve(record);
      });
      fetchNextPage();
    }, function done(err){
      if(err)
        return reject(err);
      return reject('Not Found');
    });
  });
}

exports.FindbyUsername = function(username){
  return new Promise((resolve,reject)=>{
    base('users').select({}).eachPage(function page(records, fetchNextPage){
      records.forEach((record) => {
        if(username === record.get('user'))
          return resolve(record);
      });
      fetchNextPage();
    }, function done(err){
      if(err)
        return reject(err);
      return reject('Not Found');
    });
  });
}
