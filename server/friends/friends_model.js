// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var friendSchema = new Schema({
    user_id: {type: Schema.Types.ObjectId, ref: 'users'},
    friend_id: {type: Schema.Types.ObjectId, ref: 'users'},
    status: {type: String},
    create_date: {type: Date}
});
// the schema is useless so far
// we need to create a model using it
var friends = mongoose.model('friends', friendSchema);

// make this available to our blogs in our Node applications
module.exports = friends;