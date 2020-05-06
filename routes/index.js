var express = require('express');
var router = express.Router();

module.exports = function(models) {

    var Card = models.card;

    router.get('/', function(req, res, next) {
        //res.send('respond with a resource');
    });

    router.post('/post-card', function(req, res, next) {
        let data = req.body;
        data.Body.forEach(async (card) => {
            await Card.findOne({ where: {number: card.Number } })
                .then((record) => {
                    if (record) {
                        record.update({
                            periods: card.Periods,
                            allow_exit: card.AllowExit,
                            activated: card.Activated
                        });
                    } else {
                        Card.create({
                            number: card.Number,
                            periods: card.Periods,
                            allow_exit: card.AllowExit,
                            activated: card.Activated
                        });
                    }
                });
        });

        res.status(201).send();
    });


    return router;

}
