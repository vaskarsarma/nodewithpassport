var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var passport = require("passport");
var parseString = require('xml2js').parseString;
var fs = require("fs");
//var parser = require('xml2json');

require("./passport-init");

app.set("views", "./views");
app.set('view engine', 'jade');

app.use(require("./logging.js"));

app.use(express.static("public"));
app.use(express.static("node_modules/bootstrap/dist"));
app.use(express.static("node_modules/jquery/dist"));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(require('express-session')({
  secret: 'keyboard cat', resave: false, saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

var authRouter = require("./auth");
app.use(authRouter);

app.use(function (req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
    next();
    return;
  }
  res.redirect("/login");
});

app.get('/', function (req, res) {
//   var xml = "<root>Hello xml2js!</root>"
//   parseString(xml, function (err, result) {
//     console.log(result);
// });

fs.readFile( './data/fares.xml', function(err, data) {
    parseString(data, function (err, result) {
      //var json = parser.toJson(result);
        console.log(result.fares.resources);       
        // console.log(json);
    });
});
  res.render("home", {title: "Home"});
});

var adminRouter = require("./admin");
app.use("/admin", adminRouter);

var apiRouter = require("./api");
app.use("/api", apiRouter);

app.listen(3000, function () {
  console.log('Server listening on port 3000!');
});