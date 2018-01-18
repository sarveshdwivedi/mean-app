var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    user            : [{ type: Schema.Types.ObjectId, ref: 'users' }],
    comment         : { type: String, required: 'Message is required!'},
    image           : [{ type: String}],
    create_date     : { type: Date }
});

module.exports = mongoose.model('Comment', commentSchema);

