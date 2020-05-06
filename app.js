var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var debug = require("debug");
var logger = require("morgan");
var passport = require("passport");
var session = require("express-session");
var bodyParser = require("body-parser");
var cors = require("cors");
var flash = require("connect-flash");

var log = debug("turniket:log");
var error = debug("turniket:error");

var models = require("./models");

const controller = require("./libs/controller");

var indexRouter = require("./routes/index")(models);
var authRouter = require("./routes/auth")(passport);
var cardsRouter = require("./routes/cards")(models.card);
var readersRouter = require("./routes/readers")(models.reader, controller);
var logsRouter = require("./routes/logs")(models, controller);

controller();

var app = express();

app.use(cors());
app.use(flash());

app.use(logger("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//For BodyParser
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// For Passport
app.use(
    session({ secret: "TrioLockSecret", resave: true, saveUninitialized: true })
); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

require("./libs/passport")(passport, models.user);

app.use("/", indexRouter);
app.use("/api/auth", authRouter);
app.use("/api/cards", cardsRouter);
app.use("/api/readers", readersRouter);
app.use("/api/logs", logsRouter);

//Sync Database
/*models.sequelize.sync().then(function() {
    log('Nice! Database looks fine')
}).catch(function(err) {
    error(err, "Something went wrong with the Database Update!")
});*/

app.use(function (req, res, next) {
    var err = req.session.error;
    var msg = req.session.success;
    delete req.session.error;
    delete req.session.success;
    res.locals.message = "";
    if (err) res.locals.message = '<p class="msg error">' + err + "</p>";
    if (msg) res.locals.message = '<p class="msg success">' + msg + "</p>";
    next();
});

module.exports = app;
