var express = require('express');
var router = express.Router();
var validator = require('express-validator');
router.use(validator());
var path = require("path");
var fs = require('fs');
var formidable = require('formidable');
var util = require('util');
var fs = require('fs-extra');
var Auth = require('../../passport/auth');


var friendsController = require('./friends_ctrl');


router.get('/getFriendData/:friendId', function(req, res) {
    usersController.getFriendData(req, res);
});

router.get('/serachFriend/:keyword', Auth.isAuthenticated, function(req, res) {
    friendsController.serachFriend(req, res);
});

router.get('/addFriend/:friendid', Auth.isAuthenticated, function(req, res) {
    friendsController.addFriend(req, res);
});

router.get('/acceptRequest/:friendid', Auth.isAuthenticated, function(req, res) {
    friendsController.acceptRequest(req, res);
});

router.get('/removeFriend/:friendid', Auth.isAuthenticated, function(req, res) {
    friendsController.removeFriend(req, res);
});

router.get('/rejectRequest/:friendid', Auth.isAuthenticated, function(req, res) {
    friendsController.rejectRequest(req, res);
});

router.get('/removeFriend/:id', Auth.isAuthenticated, function(req, res) {
    friendsController.deleteComment(req, res);
});

router.get('/getFriend', Auth.isAuthenticated, function(req, res) {
    friendsController.getFriend(req, res);
});

router.get('/userFriendsArray', Auth.isAuthenticated, function(req, res) {
    friendsController.userFriendsArray(req, res);
});


module.exports = router;
