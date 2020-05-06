var express = require('express');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    return res.status(401).send({ success: false, message: '' });
}

module.exports = function(reader_model, controller) {

    var Reader = reader_model;

    router.get('/', isAuthenticated, async function(req, res, next) {
        const readers = await Reader.findAll();
        return res.send(readers);
    });

    router.post('/', isAuthenticated, async function(req, res, next) {
        const reader = await Reader.create({
            name: req.body.name,
            type: req.body.type,
            format: req.body.format,
            direction: req.body.direction,
            port: req.body.port,
            pin: req.body.pin,
            pin_led: req.body.pin_led,
            check_periods: req.body.check_periods
        });
        controller();
        return res.status(201).send(reader);
    });

    router.put('/:id', isAuthenticated, async function(req, res, next) {
        const reader = await Reader.update(
            {
                name: req.body.name,
                type: req.body.type,
                format: req.body.format,
                direction: req.body.direction,
                port: req.body.port,
                pin: req.body.pin,
                pin_led: req.body.pin_led,
                check_periods: req.body.check_periods
            },
            { where: { id: req.params.id } }
        );
        controller();
        return res.status(200).send(reader);
    });

    router.delete('/:id', isAuthenticated, async function(req, res, next) {
        await Reader.destroy({ where: { id: req.params.id } });
        controller();
        return res.status(200).send();
    });

    router.post('/open/:id', async function(req, res, next) {
        //const reader = await Reader.findByPk(req.params.id);
        await controller.openReader(req.params.id);
        return res.status(200).send();
    });

    return router;
}
