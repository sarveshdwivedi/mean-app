var express = require('express');
var router = express.Router();
var path = require("path");
var fs = require('fs');
var formidable = require('formidable');
var util = require('util');
var fs = require('fs-extra');
var Auth = require('../../passport/auth');

var commentController = require('./comment_ctrl');


router.post('/commentsave', Auth.isAuthenticated, function(req, res) {
    console.log('test');
    commentController.commentsave(req, res);
});


router.get('/deleteComment/:id', Auth.isAuthenticated, function(req, res) {
    commentController.deleteComment(req, res);
});


module.exports = router;