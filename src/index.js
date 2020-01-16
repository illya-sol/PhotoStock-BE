const express = require('express');
const bodyparser = require('body-parser');

conf = require('./env.conf');
const userRouter = require('./users/routes.config');
const authRouter = require('./auth/routes.config');
const unsplashRouter = require('./unsplash/routes.config');

var app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if(req.method === 'OPTIONS')
      return res.sendStatus(200);
    else
      return next();
})

app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

unsplashRouter.Route(app);
userRouter.Route(app);
authRouter.Route(app);

app.listen(conf.port, () => {
  console.log('\nDevelopment Server Launched\n');
});
