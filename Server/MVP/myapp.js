var express = require('express');
var util = require('./lib/utils.js');
var router = express.Router();
var fs = require('fs');
var bodyParser = require('body-parser');
var busboy = require('connect-busboy');
// var busboyBodyParser = require('busboy-body-parser');
var session = require('express-session');

var db = require('./database/config.js');
var User = require('./database/models/user.js')

var app = express();

var urlParser = bodyParser.urlencoded({
    extended: true
});


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.use(session({
  secret: '0x/w@<RBH1(8~!BY=/B&tqR8)"47I',
  resave: false,
  saveUninitialized: true
}));



app.use(busboy());

// Passport functionality

// app.use(passport.initialize());
// app.use(passport.session());
// var passport = require('passport');
// var LocalStrategy = require('passport-local').Strategy;

// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     User.findOne({ username: username }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) {
//         return done(null, false, { message: 'Incorrect username.' });
//       }
//       // if (!user.validPassword(password)) {
//       //   return done(null, false, { message: 'Incorrect password.' });
//       // }
//       return done(null, user);
//     });
//   }
// ));
//


app.get('/checking', function(req,res){
  User.findOne({username:'nope'})
  .exec(function(err, user){
    console.log(user);
  })
  res.redirect('/')
});

app.get('/', function(req, res){
  // res.render('index');
  res.redirect('/account/login');
});

//login processing
app.get('/account/login', function(req, res){
  res.render('credentials');
});

app.post('/account/login', urlParser, function(req, res){
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username })
    .exec(function(err, user){
      if(!user){
        res.redirect('/account/login')
      } else {
        var savedPassword = user.password;
        if(savedPassword === password){
          //TODO authentication
          util.createSession(req, res, username);
        } else {
          res.redirect('/account/login');
        }
      }
    })
});

app.get('/account/register', function(req, res){
  res.render('register');
});

app.post('/account/register', urlParser, function(req, res){

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
            fs.mkdir(__dirname + '/files/users/' + username);
            util.createSession(req, res, username);
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
      User.findOne({username: req.session.user}).exec(function(err, user){
        user.audioFiles.push('/video/' + filename);
        user.save();
        res.redirect('/gallery');
      })
    });
  });
});

//rendering uploaded images
app.get('/gallery', function(req, res){
  var videoAddress;
  User.findOne({username: req.session.user})
    .exec(function(err, user){
      if(err){
        res.send(500, err);
      } else {
        videoAddress = user.audioFiles[user.audioFiles.length - 1];
        console.log(user.audioFiles);
        res.render('gallery', {file: videoAddress});
      }
    })
  // res.render('gallery', {user: req.session.user, latestfile: });
});

// app.get('/img/dt141101.gif', function(req,res){
//   res.sendFile(__dirname + '/files/dt141101.gif');
// });

app.get('/img/*', function(req, res){
  console.log(req.params);
  if(true){
    console.log('placeholder');
  }
  res.sendFile(__dirname + '/files/' + req.params[0]);
});

app.get('/video/*', function(req, res){
  res.sendFile(__dirname + '/files/' + req.params[0]);
})

//
var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

console.log('Example app listening at http://%s:%s', host, port);

});