var express = require('express');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    return res.status(401).send({ success: false, message: '' });
}

module.exports = function(models, controller) {

    var Log = models.log;
    var Reader = models.reader;
    var Card = models.card;

    router.get('/', isAuthenticated, async function(req, res, next) {
        const logs = await Log.findAll({
            order: [['createdAt', 'DESC']],
            include: [{ model: Reader }, { model: Card }]
        });
        return res.send(logs);
    });

    router.get('/push', async function(req, res, next) {
        //const reader = await Reader.findByPk(req.params.id);
        await controller.pushLogs();
        return res.status(200).send();
    });

    router.get('/:card_id', isAuthenticated, async function(req, res, next) {
        const logs = await Log.findAll({
            where: { card_id: req.params.card_id },
            order: [['createdAt', 'DESC']],
            include: [{ model: Reader }]
        });
        return res.send(logs);
    });

    return router;
}
