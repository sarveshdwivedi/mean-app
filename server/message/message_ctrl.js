var messageModel = require('./message_model');


function controllers(params)
{

    this.saveMessage = function(req, res) {

        console.log('Call Save text message controller');
        sess = req.session;
        var post = req.body;
        var _id = req.session.passport.user;
        var d = new Date();

        req.checkBody('reciever_id', "Please select user from drop box").notEmpty();
        req.checkBody('message', "Please enter message.").notEmpty();
        var errors = req.validationErrors();

        if (errors) {
            res.json({status: "0", message: errors});
        } else {
            var data = {
                //id: randomString(8),
                sender_id: _id,
                reciever_id: post.reciever_id,
                body: post.message,
                create_date: d.toLocaleString()
            };

            var messageData = new messageModel(data);
            messageData.save(function(err, MessageData) {
                if (err) {
                    //return console.log(err);
                    res.json({status: 201, message: err});
                } else {
                    res.json({status: 200, message: 'You have sucessfully send message to user'});
                }
            });
        }

    }


    this.getInboxMsgs = function(req, res) {
        sess = req.session;
        console.log('user session id ' + req.session.passport.user)
        messageModel.find({reciever_id: req.session.passport.user})
                .populate('sender_id')
                .populate('reciever_id')
                .exec(function(err, msgList) {
                    if (err) {
                        res.json({status: 201, messages: err});
                    } else {
                        res.json({status: 200, data: msgList});
                    }
                });
    }
    
    this.getSentItems = function(req, res) {
        sess = req.session;
        console.log('user session id ' + req.session.passport.user)
        messageModel.find({sender_id: req.session.passport.user})
                .populate('sender_id')
                .populate('reciever_id')
                .exec(function(err, msgList) {
                    if (err) {
                        res.json({status: 201, messages: err});
                    } else {
                        res.json({status: 200, data: msgList});
                    }
                });
    }


}
module.exports = controllers;