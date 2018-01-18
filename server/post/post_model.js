var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
    user            : { type: Schema.Types.ObjectId, ref: 'users' },
    comments        : [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    message         : { type: String},
    image           : [{ type: String}],
    type           : { type: String},
    create_date     : { type: Date }
});

module.exports = mongoose.model('Post', postSchema);

