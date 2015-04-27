var express = require('express');
var router = express.Router();

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res){
	res.render('index');
});

app.get('/submit', function(req,res){
	res.render('submit');
});


var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

console.log('Example app listening at http://%s:%s', host, port);

});