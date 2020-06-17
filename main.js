var express = require('express');
var path = require('path');
var async = require('async');

var app = express();

var port;

app.use(express.static(path.join(__dirname, 'public')));

if (process.argv[2] === '-p') {
   port = process.argv[3];
}

app.use(function(req, res, next) {
    console.log('Handling ' + req.path + '/' + req.method);
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Expose-Headers', 'Location');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

app.options('/*', function(req, res) {
    res.status(200).end();
});

app.use(function(req, res) {
    console.log(404);
});

app.use(function(err, req, res, next) {
    console.log(500);
});

app.listen(port, function() {
    console.log('App listening on port ' + port);
});