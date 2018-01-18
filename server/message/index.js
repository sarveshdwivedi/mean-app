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


var messageControllers = require('./message_ctrl');
var messageController = new messageControllers();




router.post('/savemessage', Auth.isAuthenticated, function(req, res) {
    messageController.saveMessage(req, res);
});

router.get('/getInboxMsgs', Auth.isAuthenticated, function(req, res) {
    messageController.getInboxMsgs(req, res);
});

router.get('/getSentItems', Auth.isAuthenticated, function(req, res) {
    messageController.getSentItems(req, res);
});


module.exports = router;
