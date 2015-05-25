var express = require('express');
var router = express.Router();

var app = express();

app.get('/', function(req, res){
	res.render('index');
});

console.log('FileTree is listening on 3000');
app.listen(3000);