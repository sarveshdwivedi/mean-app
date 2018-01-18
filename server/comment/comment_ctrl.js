var Comment = require('./comment_model');
var Post = require('../post/post_model');
module.exports = {    
    commentsave: function(req, res) {
        console.log('Save comment controller');
        console.log(req.body);
        var d = new Date();
        var commentRecord = new Comment({
            user: req.body.userId,
            comment: req.body.comment,
            image: req.body.image,
            create_date: d.toLocaleString()
        });
        console.log(req.body);
        commentRecord.save(function(err) {
            if (err) {                                
                res.json({status: 201, message: err});
            } else {
                Post.update({_id: req.body.messageId}, {$push: {comments: commentRecord._id}},
                function(err, numberAffected, raw) {
                    if (err) {
                        res.json({status: 1001, message: err});
                    } else {
                        res.json({status: 200, message: 'Comment posted successfully'});
                    }
                });
            }
        });
    },
    deleteComment: function(req, res) {        
        console.log('Calling comment delete controller before- Id-:' + req.params.id);
        //productmodel.remove({productname: "test01"}, function(err) {
        Comment.remove({_id: req.params.id}, function(err) {
            if (err)
                throw err;

            console.log('Post has been deleted');
            res.json({status: 200, message: "Comment has been deleted"});
        });
    }

}


