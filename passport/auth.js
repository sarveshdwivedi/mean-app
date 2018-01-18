var jwt = require('jsonwebtoken');
var config = require('./config');
exports.isAuthenticated = function (req, res, next) {
    console.log(config.secret);
    if (req.headers['authorization']) {
        var token = req.headers['authorization'];
        token = token.split('Bearer');
        token = token[1];
        var str = token.replace(/\s/g, '');
        console.log('str=====>'+str);
        try {
            var decoded = jwt.verify(str, config.secret);
            req.user = decoded;
            next();
        } catch (err) {
            res.json({
                'message': 'Unauthorized'
            });
        }
    } else {
        res.json({
            'message': 'Unauthorized'
        });
    }
}