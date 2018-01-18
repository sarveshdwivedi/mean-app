var friendsModel = require('./friends_model');
async = require("async");

function controllers(params)
{
    this.addFriend = function(req, res) {
        console.log('Call add Friend controller');
        sess = req.session;
        var _userid = req.session.passport.user;
        var d = new Date();
        var records = [{
                user_id: _userid,
                friend_id: req.params.friendid,
                status: 1,
                create_date: d.toLocaleString()
            },
            {
                user_id: req.params.friendid,
                friend_id: _userid,
                status: 0,
                create_date: d.toLocaleString()
            }];
        //var records = [record, record1];
        async.each(records,
                // 2nd param is the function that each item is passed to
                        function(record, callback) {
                            console.log('Inside async');
                            // Call an asynchronous function, often a save() to DB
                            var recordData = new friendsModel(record);
                            recordData.save(function(err, recordData) {
                                // Async call is done, alert via callback
                                callback();
                            });
                        },
                        // 3rd param is the function to call when everything's done
                                function(err) {
                                    // All tasks are done now
                                    if (err) {
                                        //return console.log(err);
                                        res.json({status: 201, message: err});
                                    } else {
                                        res.json({status: 200, message: 'Friend request has been sent'});
                                    }
                                }
                        );

                    }

            this.acceptRequest = function(req, res) {
                console.log('call accept request controller');
                sess = req.session;

                friendsModel.update({"$or": [{user_id: req.session.passport.user, friend_id: req.params.friendid}, {friend_id: req.session.passport.user, user_id: req.params.friendid}]}, {'$set': {status: 2}}, {upsert: true, multi: true}, function(err) {
                    if (err) {
                        res.json({status: 201, message: err});
                    } else {
                        console.log('Friend added successfully.');
                        res.json({status: 200, message: 'Friend added successfully.'});
                    }
                });
            }

            this.rejectRequest = function(req, res) {
                console.log('call reject request controller');
                sess = req.session;
                friendsModel.remove({"$or": [{user_id: req.session.passport.user, friend_id: req.params.friendid}, {friend_id: req.session.passport.user, user_id: req.params.friendid}]}, function(err) {
                    if (err) {
                        res.json({status: 201, message: err});
                    } else {
                        console.log('Friend request has been declined');
                        res.json({status: 200, message: "Friend request has been declined"});
                    }
                });
            }

            this.getFriend = function(req, res) {
                sess = req.session;
                console.log('user session id ' + req.session.passport.user);
                friendsModel.find({user_id: req.session.passport.user})
                        .populate('user_id')
                        .populate('friend_id')
                        .exec(function(err, friendList) {
                            if (err) {
                                res.json({status: 201, messages: err});
                            } else {
                                res.json({status: 200, messages: 'Friend list display', friendList: friendList});
                            }
                        });
            }

            this.removeFriend = function(req, res) {
                console.log('call reject request controller');
                console.log('Friend id - ' + req.params.friendid);
                console.log('user id - ' + req.session.passport.user);
                sess = req.session;
                friendsModel.remove({"$or": [{user_id: req.session.passport.user, friend_id: req.params.friendid}, {friend_id: req.session.passport.user, user_id: req.params.friendid}]}, function(err) {
                    if (err) {
                        res.json({status: 201, message: err});
                    } else {
                        console.log('Friend has been removed from list');
                        res.json({status: 200, message: "Friend has been removed from list"});
                    }
                });
            }

            this.serachFriend = function(req, res) {
                sess = req.session;
                keyword = req.params.keyword;
                friendsModel.find({user_id: req.session.passport.user}, {_id: 0, friend_id: 1}, function(err, friendList) {
                    if (err) {
                        res.json({status: 201, messages: err});
                    } else {
                        var userFriends = [req.session.passport.user];
                        console.log('Before friends id ' + friendList);
                        if (friendList) {
                            for (var i = 0; i < friendList.length; i++) {
                                userFriends.push(friendList[i].friend_id);
                            }
                        }
                        //friendList = friendList.push(userId);
                        console.log(userFriends);
                        usersmodel.find({_id: {$nin: userFriends}, $or: [
                                {username: new RegExp(keyword, 'i')},
                                {first_name: new RegExp(keyword, 'i')},
                                {last_name: new RegExp(keyword, 'i')},
                            ]}, {_id: 1, username: 1, first_name: 1, last_name: 1, image: 1}, function(err, userList) {
                            if (err) {
                                res.json({status: 201, messages: err});
                            } else {
                                res.json({status: 200, messages: 'Friend list display', userList: userList});
                            }
                        });
                    }
                });
            }

            this.userFriendsArray = function(req, res) {
                friendsModel.find({user_id: req.session.passport.user}, {'friend_id': 1}, function(err, friendList) {
                    if (err) {
                        res.json({status: 201, messages: err});
                    } else {
                        var userFriends = [];
                        console.log('Before add user id ' + friendList);
                        if (friendList) {
                            for (var i = 0; i < friendList.length; i++) {
                                userFriends.push(friendList[i].friend_id);
                            }
                            res.json({status: 200, messages: 'Friend list array', userFriendsArray: userFriends});
                        }
                    }
                });
            }

            this.getNotification = function(req, res) {
                friendsModel.count({user_id: req.session.passport.user, status: 0}, function(err, pendingFriends) {
                    if (err) {
                        res.json({status: 201, messages: err});
                    } else {
                        res.json({status: 200, messages: 'Pending request', pendingFriends: pendingFriends});
                    }
                });
            }
        }

module.exports = controllers;