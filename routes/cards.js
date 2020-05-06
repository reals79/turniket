var express = require('express');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    return res.status(401).send({ success: false, message: '' });
}

module.exports = function(card_model) {

    var Card = card_model;

    router.get('/', isAuthenticated, async function(req, res, next) {
        const cards = await Card.findAll();
        return res.send(cards);
    });

    router.post('/', isAuthenticated, async function(req, res, next) {
        const card = await Card.create({
            number: req.body.number,
            periods: req.body.periods,
            allow_exit: req.body.allow_exit,
            activated: req.body.activated
        });
        return res.status(201).send(card);
    });

    router.put('/:id', isAuthenticated, async function(req, res, next) {
        const card = await Card.update(
            {
                number: req.body.number,
                periods: req.body.periods,
                allow_exit: req.body.allow_exit,
                activated: req.body.activated
            },
            { where: { id: req.params.id } }
        );
        return res.status(200).send(card);
    });

    router.delete('/:id', isAuthenticated, async function(req, res, next) {
        await Card.destroy({ where: { id: req.params.id } });
        return res.status(200).send();
    });

    return router;
}
