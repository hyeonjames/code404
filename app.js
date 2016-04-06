var express = require('express')
var app = express();
var session = require('express-session');
var Promise = require('bluebird');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
mongoose.connect('mongodb://localhost:27017/code404', function (err) {
    if (err) {
        console.log('mongoose connection error ' + error);
        throw err;
    }
    app.listen(80);
});

function loadRoutes(url, func) {
    var route = express.Router();
    func(route);
    app.use(url, route);
}

app.use(express.static('./public'));
app.use(session({
    secret : 'code404',
    resave : false, // 세션 값이 변경될 경우 자동 저장 여부
    saveUninitialized : true 
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
loadRoutes('/api/account/',require('./routes/account.js'))
loadRoutes('/api/article',require('./routes/article.js'));
