module.exports = function (app) {
  app.use('/', require('./server/user'));
  app.use('/users', require('./server/user'));
  app.use('/friends', require('./server/friends'));
  app.use('/post', require('./server/post'));
  app.use('/message', require('./server/message'));
  app.use('/comment', require('./server/comment'));
};