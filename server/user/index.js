var express = require('express');
var router = express.Router();
var validator = require('express-validator');
router.use(validator());
var path = require("path");
var fs = require('fs');
var formidable = require('formidable');
var util = require('util');
var fs = require('fs-extra');
var passport = require('passport');
var Auth = require('../../passport/auth');

var usersController = require('./users_ctrl');


router.get('/', function (req, res, next) {
    res.render('/index.html');
});

router.post('/login', function (req, res) {
    usersController.loginUser(req, res);
});

router.post('/register', function (req, res) {
    usersController.registerUser(req, res);
});

router.get('/useractivate/:id', function (req, res) {
    usersController.userActivate(req, res);
});

router.get('/getuserdata/:id', Auth.isAuthenticated, function (req, res) {
    console.log('getuserdatagetuserdata')
    usersController.getuserdata(req, res);
});

router.get('/getFriendData/:friendId', function (req, res) {
    console.log('friend id ' + req.params.friendId);
    usersController.getFriendData(req, res);
});

router.get('/userList', Auth.isAuthenticated, function (req, res) {
    usersController.userList(req, res);
});


router.post('/forgotpass', function (req, res) {
    usersController.forgotPass(req, res);
});

router.post('/changePassword', function (req, res) {
    usersController.changePassword(req, res);
});

router.post('/submitforgotpass/:id', function (req, res) {
    usersController.submitForgotData(req, res);

});

router.post('/submitUserData', function (req, res) {
    usersController.submitUserData(req, res);
});


router.post('/upload/:id', Auth.isAuthenticated, function (req, res) {
    console.log('Uploadimage action');
    var usersmodel = require('./users_model');
    var timestamp = Number(new Date()); // current time as number
    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
        if (Object.keys(files).length > 0) {
            fs.readFile(files.file.path, function (err, data) {
                var imagePath = "public/images/uploads/" + timestamp + files.file.name;
                fs.writeFile(path.resolve(imagePath), data, function (err) {
                    if (err) {
                        console.log(err);
                        res.status(207).json({ status: 0, error: { 'message': 'image not uploaded properly' } });
                    } else {
                        var appenddata = {
                            image: '/images/uploads/' + timestamp + files.file.name
                        }
                        usersmodel.update({ _id: req.params.id }, { $set: appenddata }, function (err) {
                            if (err)
                                throw err;

                            console.log('Profile image has been updated');
                            res.json({ status: '200', message: 'Profile image has been updated', imagename: timestamp + files.file.name});
                        });

                    }
                });
            });
        }
    });
});





module.exports = router;
