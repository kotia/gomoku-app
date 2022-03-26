var express = require('express');
var app = express();

/* GET home page. */

app.get('/', function(req, res) {
    var env = req.params.env || process.env.NODE_ENV;

    res.render('index', { env: env });
});


module.exports = app;
