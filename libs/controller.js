const SerialPort = require("serialport");
const Wiegand = require("wiegand-node");
const Gpio = require("onoff").Gpio;
const moment = require("moment");
const models = require("../models");
const axios = require("axios");
const env = process.env.NODE_ENV || "production";
const config = require(__dirname + "/../config/config.json")[env];

const Reader = models.reader;
const Card = models.card;
const Log = models.log;
var buffer = "";
global.readers = [];

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

function led(led_gpio) {
    if (!led_gpio) return;

    led_gpio.writeSync(1);
    setTimeout((_) => {
        led_gpio.writeSync(0);
    }, 3000);
}

function relay(relay_gpio) {
    if (!relay_gpio) return;

    relay_gpio.writeSync(1);
    setTimeout((_) => {
        relay_gpio.writeSync(0);
    }, 500);
}

async function check_card(card_number, card_model, reader) {
    const card = await card_model.findOne({
        where: { number: card_number, activated: 1 },
    });
    if (card) {
        if (!reader.check_periods) return card;

        var result = false;
        card.periods.forEach((period) => {
            let fromTime = period.From;
            let toTime = period.To;
            if (fromTime == "" && toTime == "") return;

            if (fromTime == "") fromTime = "00:00";
            if (toTime == "") toTime = "23:59";

            fromTime = moment(fromTime, "H:mm");
            toTime = moment(toTime, "H:mm");
            if (!result && moment().isBetween(fromTime, toTime)) {
                result = true;
                return;
            }
        });
        if (!result) return false;

        return card;
    }

    return false;
}

async function pushLogs() {
    console.log("Logs Push!");
    var logs_data = [];
    if (config["1c_host"] && config["1c_host"] !== "") {
        await Log.findAll({
            where: { synced: 0 },
            include: [{ model: Card }, { model: Reader }],
            limit: 25,
        }).then((logs) => {
            logs.forEach((log) => {
                if (log.card) {
                    let data = {
                        id: log.id,
                        card_number: log.card.number,
                        direction: log.reader ? log.reader.direction : "",
                        created_at: moment(log.createdAt).format(
                            "YYYY-MM-DD HH:mm:ss"
                        ),
                    };
                    logs_data.push(data);
                }
            });
            let data = {
                Reason: "",
                Body: logs_data,
            };

            let json_data = JSON.stringify(data);

            if (config["1c_host"] && config["1c_host"] !== "") {
                axios({
                    method: "post",
                    url: config["1c_host"],
                    headers: { "content-type": "application/json" },
                    auth: {
                        username: config["1c_username"],
                        password: config["1c_password"],
                    },
                    data: json_data,
                })
                    .then((res) => {
                        //console.log(`statusCode: ${res.statusCode}`)
                        //console.log(res);
                        logs.forEach((log) => {
                            if (log.card) {
                                Log.update(
                                    { synced: 1 },
                                    { where: { id: log.id } }
                                );
                            }
                        });
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        });
    }
}

async function getReaders() {
    if (readers.length) {
        await readers.forEach((reader) => {
            if (reader.type == "RS232") {
                try {
                    reader.port.close();
                } catch (err) {}
            }
            if (reader.type == "Wiegand") {
                reader.port.stop();
                reader.port = null;
            }
            try {
                reader.led.unexport();
            } catch (err) {}
            try {
                reader.relay.unexport();
            } catch (err) {}
            reader.led = null;
            reader.relay = null;
        });
        readers = [];
    }

    try {
        let rds = await Reader.findAll();

        await asyncForEach(rds, async (record) => {
            let port = null;
            let led = null;
            let relay = null;
            if (record.type == "RS232") {
                try {
                    port = new SerialPort(record.port, { baudRate: 9600 });
                } catch (err) {}
            }
            if (record.type == "Wiegand") {
                let pins = record.port.split(",");
                try {
                    port = new Wiegand({ d0: pins[0], d1: pins[1] });
                } catch (err) {}
            }

            try {
                led = new Gpio(record.pin_led, "out");
            } catch (err) {}
            try {
                relay = new Gpio(record.pin, "out");
            } catch (err) {}

            let reader = {
                id: record.id,
                type: record.type,
                format: record.format,
                direction: record.direction,
                port: port,
                led: led,
                relay: relay,
                check_periods: record.check_periods,
            };
            readers.push(reader);
        });
    } catch (err) {
        console.log(err);
    }
}

module.exports = async function () {
    await getReaders();

    readers.forEach((reader) => {
        if (reader.port) {
            if (reader.type == "RS232") {
                reader.port.on("data", async (chunk) => {
                    buffer += chunk.toString();
                    var buffer_arr = buffer.split(/\r?\n/);
                    var number = buffer_arr[0].replace(
                        /[\u{0001}-\u{0007}]/gu,
                        ""
                    );
                    /* if (
                        number.charCodeAt(0) === 0x0001 ||
                        number.charCodeAt(0) === 0x0002 ||
                        number.charCodeAt(0) === 0x0003 ||
                        number.charCodeAt(0) === 0x0004
                    ) {
                        number = number.slice(1);
                    }
                    if (
                        number.charCodeAt(number.length - 1) === 0x0001 ||
                        number.charCodeAt(number.length - 1) === 0x0002 ||
                        number.charCodeAt(number.length - 1) === 0x0003 ||
                        number.charCodeAt(number.length - 1) === 0x0004
                    ) {
                        number = number.slice(0, -1);
                    } */
                    console.log(number, number.length);
                    if (buffer_arr.length > 0 && number.length == 10) {
                        //number = buffer.slice(1, 11);
                        buffer = "";

                        console.log(`> ${number} - ${reader.direction}`);

                        let card_number = number.toString();
                        //console.log(`> ${card_number} - ${reader.direction}`);
                        if (
                            (card = await check_card(card_number, Card, reader))
                        ) {
                            if (
                                reader.direction == "in" ||
                                (reader.direction == "out" && card.allow_exit)
                            ) {
                                led(reader.led);
                                relay(reader.relay);
                            }
                            await Log.create({
                                card_id: card.id,
                                reader_id: reader.id,
                                synced: 0,
                            });
                            await pushLogs();
                            console.log("Access Success!");
                        } else {
                            console.log("Access Denied!");
                        }
                    }
                });
            }
            if (reader.type == "Wiegand") {
                reader.port.begin();
                reader.port.on("reader", async (idDec, idRFID, idHex) => {
                    let card_number =
                        reader.format == "decimal" ? idRFID : idHex;
                    card_number =
                        reader.format == "decimal-1c"
                            ? parseInt(idHex, 16).toString(10)
                            : card_number;

                    if ((card = await check_card(card_number, Card, reader))) {
                        if (
                            reader.direction == "in" ||
                            (reader.direction == "out" && card.allow_exit)
                        ) {
                            led(reader.led);
                            relay(reader.relay);
                        }
                        await Log.create({
                            card_id: card.id,
                            reader_id: reader.id,
                            synced: 0,
                        });
                        await pushLogs();
                        console.log("Access Success!");
                    } else {
                        console.log("Access Denied!");
                    }
                });
            }
        }
    });
};

module.exports.openReader = async function (reader_id) {
    var reader = readers.filter(function (rdr) {
        return rdr.id == reader_id;
    });
    console.log("Open Reader: ", reader_id);
    if (reader) {
        led(reader[0].led);
        relay(reader[0].relay);
    }
};

module.exports.pushLogs = async function () {
    await pushLogs();
};
