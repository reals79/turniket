var express = require('express');
var router = express.Router();
var User = require('../models').user;

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    return res.status(401).send({ success: false, message: '' });
}

module.exports = function(passport) {

    router.get('/', isAuthenticated, function(req, res, next) {
        return res.send({ success: true, user: req.user })
    });

    router.post('/login',
        passport.authenticate('local-login', {
            failWithError: true,
            failureFlash: true
        }),
        function(req, res, next) {
            return res.send({ success: true, user: req.user })
        },
        function(err, req, res, next) {
            return res.status(401).send({ success: false, message: req.flash('error').join('<br>') })
        }
    );

    router.get('/logout', function(req, res) {
        req.logout();
        return res.send({ success: true })
    });

    router.put('/update-password', isAuthenticated, async function(req, res, next) {

        const user =  await User.update(
            {
                password: req.body.password
            },
            { where: { id: req.user.id }, individualHooks: true }
        );

        return res.status(200).send(user);
    });

    return router;
}
