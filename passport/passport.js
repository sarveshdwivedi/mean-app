'use strict';

// Passport management
var BearerStrategy   = require('passport-http-bearer').Strategy,
    jwt = require('jsonwebtoken'),
    config = require('./config.js');

// Module exports
module.exports = function(passport) {
	// Bearer token based authentication
 	passport.use(new BearerStrategy(function (token, done) {
		jwt.verify(token, config.privateKey, function (err, user) {
	      	if (err) {
	  			return done(err);
	      	} else {
	      		if(user){
	      			return done(null, user);
	      		}else{
	      			return done(null, false);
	      		}
	      	}
	    });
	}));
}