var express = require('express');
var router = express.Router();
var fs = require('fs');
var bodyParser = require('body-parser');
var busboy = require('connect-busboy');

var session = require('express-session');

var db = require('./database/config.js');
var User = require('./database/models/user.js')

var app = express();


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(busboy())
app.use(session({
  secret: '0x/w@<RBH1(8~!BY=/B&tqR8)"47I',
  resave: false,
  saveUninitialized: true
}));
// Passport functionality
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));
//

app.get('/', function(req, res){
  res.render('index');
});

//login processing
app.get('/account/login', function(req, res){
  res.render('credentials');
});

app.post('/account/login', function(req, res){
  // var username = req.body.username;
  // var password = req.body.password;

  // User.findOne({ username: username })
  //   .exec(function(err, user){
  //     if(!user){
  //       res.redirect('/account/login')
  //     } else {
  //       var savedPassword = user.password;
  //       if(savedPassword === password){
  //         //TODO authentication
  //       } else {
  //         res.redirect('/account/login');
  //       }
  //     }
  //   })
app.post('/login',
  passport.authenticate('local', { 
    successRedirect: '/',
    failureRedirect: '/account/login',
    failureFlash: true })
  );
});

app.get('/account/register', function(req, res){
  res.render('register');
});

app.post('/account/register', function(req, res){
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username })
    .exec(function(err, user){
      if(!user){
        var newUser = new User({
          username: username,
          password: password
        });
        newUser.save(function(err, newUser){
          if(err){
            res.send(500, err);
          } else {
            //TODO authentication
            passport.authenticate('local', { 
              successRedirect: '/',
              failureRedirect: '/account/login',
              failureFlash: true })
            };
        })
      } else {
        res.redirect('/account/register');
      }
    })
})

//handle uploads
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

//rendering uploaded images
app.get('/gallery', function(req, res){
  res.render('gallery');
});

app.get('/img/dt141101.gif', function(req,res){
  res.sendFile('./files/dt141101.gif');
});

app.get('/img/*', function(req, res){
  console.log(req.params);
  if(true){
    console.log('placeholder');
  }
  res.sendFile(__dirname + '/files/' + req.params[0]);
});

//
var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

console.log('Example app listening at http://%s:%s', host, port);

});