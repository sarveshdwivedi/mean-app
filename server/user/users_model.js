// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var usersSchema = new Schema({
    email: {type: String},
    username: {type: String},
    password: {type: String},
    first_name: {type: String},
    last_name: {type: String},
    phone_number: {type: String},
    location: {type: String},
    image: {type: String},
    status: {type: String},
    term: {type: String},
    aboutme: {type: String},
    joined : { type: Date },
    lat : { type: String },
    lng : { type: String }
});


// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('users', usersSchema);

// make this available to our users in our Node applications
module.exports = User;