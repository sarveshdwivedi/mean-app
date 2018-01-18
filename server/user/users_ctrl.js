var usersmodel = require('./users_model');
var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var jwt = require('jsonwebtoken');
var config = require('../../passport/config');
var transporter = nodemailer.createTransport(
    smtpTransport('smtps://viralcontentsystem@gmail.com:viral@123@smtp.gmail.com')
);

var mailOptions;

exports.loginUser = function (req, res) {
    console.log('Users login controller calling!');
    var post = req.body;
    console.log('Users controller calling before!');
    usersmodel.findOne({ username: post.username, password: post.password }, { _id: 1, email: 1, username: 1, status:1,first_name:1,last_name:1,location:1,image:1,aboutme:1,joined:1 }, function (err, users) {
        if (err) {
            throw err;
        } else {
            console.log('Users controller calling after!');
            if (users) {
                if (users.status == 1) {
                    var token = jwt.sign(users, config.secret);
                    res.json({ status: 200, message: 'You have logged in successfully', data: users, token: token });
                } else {
                    res.json({ status: 201, message: 'Sorry! your account is not activated yet.' });
                }
            } else {
                res.json({ status: 201, message: 'Username or password is not valid' });
            }
        }
    });
}

exports.registerUser = function (req, res) {
    var post = req.body;
    var d = new Date();
    console.log(post);
    req.checkBody('username', "Please enter username.").notEmpty();
    req.checkBody('password', "Password should be min 6 to 20 characters required").len(6, 20);
    req.checkBody('password_confirmation', 'Password and Confirm Password should be same.').equals(post.password);
    req.checkBody('email', "Please enter a valid email address.").isEmail();
    req.checkBody('term', "Please check user agreement.").notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        res.json({ status: "202", message: errors });
    } else {
        console.log('call register controller! before');
        var userdata = {
            username: post.username,
            password: post.password,
            email: post.email,
            first_name: '',
            last_name: '',
            phone_number: '',
            location: '',
            country: '',
            image: '',
            status: 0,
            term: post.term,
            aboutme: '',
            joined: d.toLocaleString(),
            lat: '',
            lng: ''
        };
        usersmodel.findOne({ username: post.username, password: post.password }, function (err, users) {
            if (err) {
                throw err;
            } else {
                console.log('Users controller calling after!');
                if (users) {
                    if (users.username == post.username) {
                        res.json({ status: 201, message: 'Username already registered.' });
                    } else if (users.email == post.email) {
                        res.json({ status: 201, message: 'Email already registered.' });
                    }
                } else {
                    var usersdata = new usersmodel(userdata);
                    // call the built-in save method to save to the database
                    usersdata.save(function (err, usersdata) {
                        if (err)
                            throw err;

                        console.log('User saved successfully!' + usersdata._id);
                        // setup e-mail data with unicode symbols
                        var mailOptions = {
                            from: 'viralcontentsystem@gmail.com', // sender address
                            to: post.email, // list of receivers
                            subject: 'Please confirm your Email account', // Subject line
                            text: 'sarvesh', // plaintext body
                            html: 'Hello ' + post.username + ',<br><br> Your account has been registered. Please follow the link bellow to activate your account: <br><br> \n\ <p><a target="_blank" href="http://localhost:3000/#/useractivate/' + usersdata._id + '">Click Here</a></p><br><br>Thanks,<br> Sarvesh Dwivedi,<br>Mean Assignment' // html body
                        }

                        console.log(mailOptions);
                        // send mail with defined transport object
                        transporter.sendMail(mailOptions, function (error, response) {
                            if (error) {
                                console.log(error);
                                res.json({ status: 200, message: 'Successfully registered! and email failed.' });
                            } else {
                                console.log("Message sent: Successfully");
                                res.json({ status: 200, message: 'Successfully registered! and email sent.' });
                            }
                        });

                    });
                }
            }
        });

    }


}


exports.userActivate = function (req, res) {
    console.log('Users login controller calling!');
    var appenddata = {
        status: 1
    }
    usersmodel.update({ _id: req.params.id }, { $set: appenddata }, function (err) {
        if (err)
            throw err;

        console.log('Account has been activated');
        res.json({ status: 200, message: 'Account has been activated' });
    });
}


exports.forgotPass = function (req, res) {
    var post = req.body;
    console.log('Users forgotdata controller calling!');
    usersmodel.findOne({ email: post.email }, function (err, users) {
        if (err) {
            throw err;
        } else {
            if (users) {
                var mailOptions = {
                    from: 'viralcontentsystem@gmail.com', // sender address
                    to: post.email, // list of receivers
                    subject: 'Forgot password', // Subject line
                    text: 'sarvesh', // plaintext body
                    html: 'Hello There,<br><br> Please follow the link bellow to activate your account: <br><br> \n\ <p><a target="_blank" href="http://localhost:3000/#/forgotuserpassword/' + users._id + '">Click Here</a></p><br><br>Thanks,<br> Sarvesh Dwivedi,<br>Mean Assignment' // html body
                }
                console.log(mailOptions);
                // send mail with defined transport object
                transporter.sendMail(mailOptions, function (error, response) {
                    if (error) {
                        console.log(error);
                        res.json({ status: 200, message: 'Something went wrong, please try again.' });
                    } else {
                        console.log("Message sent: Successfully");
                        res.json({ status: 200, message: 'Please check your inbox for further process.' });
                    }

                    // if you don't want to use this transport object anymore, uncomment following line
                    //smtpTransport.close(); // shut down the connection pool, no more messages
                });
            } else {
                res.json({ status: 201, message: 'Email id is not registered' });
            }

        }
    });
}

exports.getuserdata = function (req, res) {
    console.log('getuserdata');
    usersmodel.findOne({ _id: req.params.id }, { _id: 1, email: 1, username: 1, status:1,first_name:1,last_name:1,location:1,image:1,aboutme:1,joined:1 }, function (err, users) {
        if (err) {
            res.json({ status: 201, message: err });
        } else {
            // console.log(eventsData);
            res.json({ status: 200, userdata: users });
        }
    });
}

exports.getFriendData = function (req, res) {
    sess = req.session;
    usersmodel.findOne({ _id: req.params.friendId }, { password: 0 }, function (err, users) {
        if (err)
            throw err;

        res.json({ status: 200, message: users });
    });
}

exports.submitForgotData = function (req, res) {
    var post = req.body;
    console.log('Users forgot password controller calling!');
    req.checkBody('password', "Please enter password.").notEmpty();
    req.checkBody('password_confirmation', "Please Enter confirm password.").notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        console.log(errors);
        res.json({ status: "No", message: errors });
    } else {
        var appenddata = {
            password: post.password
        }
        usersmodel.update({ _id: req.params.id }, { $set: appenddata }, function (err) {
            if (err)
                throw err;

            console.log('Password has been reset');
            res.json({ status: 200, message: 'Password has been reset' });
        });
    }

}

exports.changePassword = function (req, res) {
    var post = req.body;
    sess = req.session;
    console.log('Users change password controller calling!');
    req.checkBody('password', "Please enter password.").notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        console.log(errors);
        res.json({ status: "No", message: errors });
    } else {
        var appenddata = {
            password: post.password
        }
        usersmodel.update({ _id: req.session.passport.user }, { $set: appenddata }, function (err) {
            if (err)
                throw err;

            console.log('Password has been change');
            res.json({ status: 200, message: 'Password has been change' });
        });
    }
}

exports.submitUserData = function (req, res) {
    var post = req.body;
    console.log('Users update controller calling!'+post);
    var appenddata = {
        first_name: post.first_name,
        last_name: post.last_name,
        phone_number: post.phone_number,
        location: post.location,
        aboutme: post.aboutme,
        lat: post.lat,
        lng: post.lng
    }
    
    usersmodel.update({ _id: post.userId }, { $set: appenddata }, function (err, users) {
        if (err)
            throw err;

        console.log('Profile has been updated');
        res.json({ status: 200, message: 'Profile has been updated', user:users });
    });

}