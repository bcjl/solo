var express = require('express');
var router = express.Router();
var fs = require('fs');
var bodyParser = require('body-parser');
var busboy = require('connect-busboy');

var app = express();


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(busboy())

app.get('/', function(req, res){
  res.render('index');
});

app.get('/submit', function(req, res){
  res.render('submit');
});

app.post('/submit', function(req, res, next){
  var fstream;
  req.pipe(req.busboy);
  req.busboy.on('file', function (fieldname, file, filename) {
    console.log("Uploading: " + filename); 
    fstream = fs.createWriteStream(__dirname + '/files/' + filename);
    file.pipe(fstream);
    fstream.on('close', function () {
      res.redirect('/');
    });
  });
});

app.get('/gallery', function(req, res, next){
  res.render('gallery');
})


var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

console.log('Example app listening at http://%s:%s', host, port);

});