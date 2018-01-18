var LocalStrategy = require('passport-local').Strategy;
var User = require('../server/user/users_model');

module.exports = function(passport) {


//    passport.serializeUser(function(user, done) {
//        var sessionUser = {_id: user._id, username: user.username, email: user.email}
//        done(null, sessionUser);
//    });

    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user.toObject());
        });
    });

    passport.use('local-login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
                //passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(username, password, done) {
        console.log('passport calling' + username + '-' + password);
        User.findOne({'username': username, 'password': password}, function(err, user) {
            if (err)
                return done(err);

            if (!user)
                return done(null, false, {message: 'Invalid Username and Password'});

            return done(null, user.toObject());
        });
    }));
};
