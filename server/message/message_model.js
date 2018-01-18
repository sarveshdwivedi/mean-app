// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var messageSchema = new Schema({
    //_id    : ObjectId,
    sender_id       :  {type: Schema.Types.ObjectId, ref: 'users', required: true}, 
    reciever_id     :  {type: Schema.Types.ObjectId, ref: 'users', required: true},
    body            :  { type: String},
    create_date     :  { type: Date }
});
// the schema is useless so far
// we need to create a model using it
var messages = mongoose.model('messages', messageSchema);

// make this available to our blogs in our Node applications
module.exports = messages;