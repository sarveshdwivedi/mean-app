var Post = require('./post_model');
var Comment = require('../comment/comment_model');
var friendsModel = require('../friends/friends_model');
module.exports = {
    messagesave: function (req, res) {
        console.log('Save post controller');
        console.log(req.body);
        var d = new Date();
        var msgRecord = new Post({
            user: req.body.userId,
            message: req.body.message,
            image: req.body.image,
            type: 0,
            create_date: d.toLocaleString()
        });
        console.log(msgRecord);
        msgRecord.save(function (err) {
            if (err) {
                res.json({ status: 201, message: err });
            } else {
                res.json({ status: 200, message: 'Post added successfully' });
            }
        });
    },
    commentsave: function (req, res) {
        console.log('Save comment controller');
        var d = new Date();
        sess = req.session;
        var commentRecord = new Comment({
            user: req.session.passport.user,
            comment: req.body.comment,
            image: req.body.image,
            create_date: d.toLocaleString()
        });
        commentRecord.save(function (err) {
            if (err) {
                res.json({ status: 201, message: err });
            } else {
                Post.update({ _id: req.params.id }, { $push: { comments: commentRecord._id } },
                    function (err, numberAffected, raw) {
                        if (err) {
                            res.json({ status: 201, message: err });
                        } else {
                            res.json({ status: 200, message: 'Comment posted successfully' });
                        }
                    });
            }
        });
    },
    getallmessage: function (req, res) {
        var userId = req.params.userId;
        console.log('Get all post controller');
        friendsModel.find({ user_id: userId, status: 2 }, { _id: 0, friend_id: 1 }, function (err, friendList) {
            if (err) {
                res.json({ status: 201, messages: err });
            } else {
                var userFriends = [req.params.userId];
                console.log('Before add user id ' + friendList);
                if (friendList) {
                    for (var i = 0; i < friendList.length; i++) {
                        userFriends.push(friendList[i].friend_id);
                    }
                }

                //friendList = friendList.push(userId);
                console.log('After add user id ' + userFriends);
                Post.find({ user: { $in: userFriends } }).sort({ create_date: -1 }).limit(2)
                    .populate('user', 'username first_name last_name')
                    .populate({ path: 'comments', populate: { path: 'user', model: 'users', select: 'username first_name last_name' } })
                    .exec(function (err, messages) {
                        if (err) {
                            res.status(201).json({ status: 0 });
                        } else {
                            res.status(200).json({ status: 1, messages: messages });
                        }
                    });
            }
        });
    },
    getMoreData: function (req, res) {
        console.log(req.body);
        console.log('Msg last id - ' + req.body.msgLastId);
        friendsModel.find({ user_id: req.body.userId, status: 2 }, { _id: 0, friend_id: 1 }, function (err, friendList) {
            if (err) {
                res.json({ status: 201, messages: err });
            } else {
                var userFriends = [req.body.userId];
                console.log('Before add user id ' + friendList);
                if (friendList) {
                    for (var i = 0; i < friendList.length; i++) {
                        userFriends.push(friendList[i].friend_id);
                    }
                }

                //friendList = friendList.push(userId);
                console.log('After add user id ' + userFriends);
                Post.find({ _id: { $lt: req.body.msgLastId }, user: { $in: userFriends } }).sort({ create_date: -1 }).limit(2)
                    .populate('user', 'first_name last_name username')
                    .populate({ path: 'comments', populate: { path: 'user', model: 'users', select: 'first_name last_name username' } })
                    .exec(function (err, messages) {
                        if (err) {
                            res.status(201).json({ status: 0 });
                        } else {
                            res.status(200).json({ status: 1, messages: messages });
                        }
                    });
            }
        });
    },


    getMessagesImages: function (req, res) {
        sess = req.session;
        console.log('Get all post images controller');
        Post.find({ user: req.session.passport.user }, { '_id': 1, 'image': 1, 'message': 1 }, function (err, messages) {
            if (err)
                res.status(201).json({ status: 0 });

            res.json({ status: 200, message: messages });
        });

    },
    deletePost: function (req, res) {
        console.log('Calling post delete controller before- Id-:' + req.params.id);
        //productmodel.remove({productname: "test01"}, function(err) {
        Post.remove({ _id: req.params.id }, function (err) {
            if (err)
                throw err;

            console.log('Post has been deleted');
            res.json({ status: 200, message: "Post has been deleted" });
        });

    },
    deleteComment: function (req, res) {
        console.log('Calling comment delete controller before- Id-:' + req.params.id);
        //productmodel.remove({productname: "test01"}, function(err) {
        Comment.remove({ _id: req.params.id }, function (err) {
            if (err)
                throw err;

            console.log('Post has been deleted');
            res.json({ status: 200, message: "Comment has been deleted" });
        });
    }

}


