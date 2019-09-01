const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('../models/users_schema');
console.log("local Strategy");
passport.use(new localStrategy({
  usernameField: 'email'
}, function (email, password, done) {


  User.findOne({ email: email }, function (err, user) {
    if (err) {
      console.log('error in finding-->passport');
      return done(err);
    }
    if (!user || user.password != password) {
      console.log('invalid username or password');
      done(null, false);
    }
    return done(null, user);

  });

}


));
// user returned by done is sent to serializer
//serializer will store userid in session-cookie which was created by xpress session and it be encrypted using the secret

passport.serializeUser(function (user, done) {
  return done(null, user.id);
});

// deserializing the user using the secret in the cookies
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    if (err) {
      console.log('error in finding-->passport');
      return done(err);
    }
    return done(null, user);
  });
});

//check if user is authenticated or not
passport.checkAuthentication = function (req, res, next) {
  //passport puts the method on request isAuthenticated(i.e.  this property is given to request by passport)
  //if the user is signed in passon the request to the next function which is controller's action
  console.log("middlware")
  if (req.isAuthenticated()) {
    return next();
  }
  //if the user is not signIn
  return res.redirect('/users/sign-in');

};


//set the user for the views
passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    //whenever a user is signed in its information is available in req.user from the session -cookie and .user property is given by the passport to the request but the it has not been given to response
    res.locals.user = req.user;

  }
  return next();
};

module.exports = passport;