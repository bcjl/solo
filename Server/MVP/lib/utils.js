exports.checkUser = function(req, res, next){

};

exports.createSession = function(req, res, user){
  return req.session.regenerate(function() {
    req.session.user = user;
    res.redirect('/submit');
    });
  };