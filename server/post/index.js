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

var postController = require('./post_ctrl');



router.post('/messagesave', Auth.isAuthenticated, function(req, res) {
    postController.messagesave(req, res);
});

router.get('/getallmessage/:userId', Auth.isAuthenticated, function(req, res) {
    postController.getallmessage(req, res);
});

router.post('/getMoreData', Auth.isAuthenticated, function(req, res) {
    postController.getMoreData(req, res);
});


router.get('/getMessagesImages', Auth.isAuthenticated, function(req, res) {
    postController.getMessagesImages(req, res);
});

router.post('/commentsave/:id', Auth.isAuthenticated, function(req, res) {
    postController.commentsave(req, res);
});

router.get('/deletePost/:id', Auth.isAuthenticated, function(req, res) {
    postController.deletePost(req, res);
});

router.get('/deleteComment/:id', Auth.isAuthenticated, function(req, res) {
    postController.deleteComment(req, res);
});

router.post('/uploadpost', Auth.isAuthenticated, function (req, res) {
    console.log('Uploadimage action');
    var timestamp = Number(new Date()); // current time as number
    sess = req.session;

    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
        if (Object.keys(files).length > 0) {
            fs.readFile(files.file.path, function (err, data) {
                var imagePath = "public/images/uploadspost/" + timestamp + files.file.name;
                fs.writeFile(path.resolve(imagePath), data, function (err) {
                    if (err) {
                        console.log(err);
                        res.status(207).json({ status: 0, error: { 'message': 'image not uploaded properly' } });
                    } else {
                        res.status(200).json({ status: 1, message: 'Image uploaded successfully', imagename: timestamp + files.file.name });
                    }
                });
            });
        }
    });
});

module.exports = router;
