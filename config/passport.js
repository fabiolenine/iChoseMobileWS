//local all the things we need
var localStrategy = require('passport-local').Strategy;

// local up the user model
var UserProvider    = require('../modulos/ProviderUserModel.js');
var UserManagement  = require('../modulos/ManagementUserModel.js');
var UserCounter     = require('../modulos/CounterUserModel.js');

// expose this function to our app using module.exports
module.exports = function(passport)
{
//
// passport session setup
//
// required for persistent login sessions
// passport needs ability to serialize and unserialize users out of session

// used to serialize the user for the session
  passport.serializeUser(function(user, done)
  {
    done(null, user.id);
  });

// used to deserialize the user
// Melhorar esse DeserializeUse área de risco de segurança
  passport.deserializeUser(function(id, done)
  {
    UserProvider.findById(id, function(err, user)
    {   
        if(err) done(err);
        if(!user) 
        {
            UserManagement.findById(id, function(err, user)
            {
                if(err) done(err);
                if(!user)
                {
                    UserCounter.findById(id, function(err, user)
                    {
                        done(err, user);
                    });
                }
                else
                {
                    done(err, user);
                }
            });
        }
        else 
        {
            done(err, user);
        }
    });
  });

//
// LOCAL SIGNUP - Provider
//
// we are using named strategies since we have one for login and one for signup
// by default, if there was no name, it would just be called 'local'

  passport.use('local-signup-provider', new localStrategy(
    {
      // by default, local strategy uses username and password, we will override with email
      usernameField     : 'email',
      passwordField     : 'password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
    },function(req, email, password, done)
        {
          // asynchronous
          // User.findOne wont fire unless data is sent back
          process.nextTick(function()
            {
  		          // find a user whose email is the same as the forms email
  		          // we are checking to see if the user trying to login already exists
                UserProvider.findOne({ 'local.email' :  email }, function(err, user) 
                  {
                    // if there are any errors, return the error
                    if (err) return done(err);

                    // check to see if theres already a user with that email
                    if (user)
                      {
                        return done(null, false, req.flash('signupMessage', 'Cadastrado já existente.'));
                      }
                    else
                      {

  				          // if there is no user with that email
                        // create the user
                        var newUser            = new UserProvider();

                        // set the user's local credentials
                        newUser.local.email    = email;
                        newUser.local.password = newUser.generateHash(password);

  				              // save the user
                        newUser.save(function(err)
                          {
                            if (err) throw err;
                            return done(null, newUser);
                          });
                      }
                    });
            });
        }));
    
//
// LOCAL SIGNUP - Management
//
  passport.use('local-signup-management', new localStrategy(
    {
      // by default, local strategy uses username and password, we will override with email
      usernameField     : 'email',
      passwordField     : 'senha',
      passReqToCallback : true // allows us to pass back the entire request to the callback
    },function(req, email, senha, done)
        {
          // asynchronous
          // User.findOne wont fire unless data is sent back
          process.nextTick(function()
            {
  		          // find a user whose email is the same as the forms email
  		          // we are checking to see if the user trying to login already exists
                UserManagement.findOne({ 'local.email' :  email }, function(err, user) 
                  {
                    // if there are any errors, return the error
                    if (err) return done(err);

                    // check to see if theres already a user with that email
                    if (user)
                      {
                        return done(null, false, req.flash('signupMessage', 'Cadastrado já existente.'));
                      }
                    else
                      {

  				          // if there is no user with that email
                        // create the user
                        var newUser            = new UserManagement();

                        // set the user's local credentials
                        newUser.local.email    = email;
                        newUser.local.password = newUser.generateHash(senha);

  				              // save the user
                        newUser.save(function(err)
                          {
                            if (err) throw err;
                            return done(null, newUser);
                          });
                      }
                    });
            });
        }));
    
//
// LOCAL SIGNUP - Counter
//
  passport.use('local-signup-counter', new localStrategy(
    {
      // by default, local strategy uses username and password, we will override with email
      usernameField     : 'email',
      passwordField     : 'password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
    },function(req, email, password, done)
        {
          // asynchronous
          // User.findOne wont fire unless data is sent back
          process.nextTick(function()
            {
  		          // find a user whose email is the same as the forms email
  		          // we are checking to see if the user trying to login already exists
                UserCounter.findOne({ 'local.email' :  email }, function(err, user) 
                  {
                    // if there are any errors, return the error
                    if (err) return done(err);

                    // check to see if theres already a user with that email
                    if (user)
                      {
                        return done(null, false, req.flash('signupMessage', 'Cadastrado já existente.'));
                      }
                    else
                      {

  				          // if there is no user with that email
                        // create the user
                        var newUser            = new UserCounter();

                        // set the user's local credentials
                        newUser.local.email    = email;
                        newUser.local.password = newUser.generateHash(password);

  				              // save the user
                        newUser.save(function(err)
                          {
                            if (err) throw err;
                            return done(null, newUser);
                          });
                      }
                    });
            });
        }));
    
    
// =========================================================================
// LOCAL LOGIN Provider=====================================================
// =========================================================================
// we are using named strategies since we have one for login and one for signup
// by default, if there was no name, it would just be called 'local'

    passport.use('local-login-provider', new localStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form
		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists
        UserProvider.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

			// if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);
        });
    }));    
    
    
// =========================================================================
// LOCAL LOGIN Management ==================================================
// =========================================================================
    passport.use('local-login-management', new localStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'senha',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, senha, done) { // callback with email and password from our form
		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists
        UserManagement.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

			// if the user is found but the password is wrong
            if (!user.validPassword(senha))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);
        });
    }));    
  
    
// =========================================================================
// LOCAL LOGIN Counter =====================================================
// =========================================================================
    passport.use('local-login-counter', new localStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form
		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists
        UserCounter.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

			// if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);
        });
    }));    
    
};
