// app/routesProvider.js
module.exports = function(app, passport) {

    app.set('views', '../iChoseProviderWeb');
    
// =====================================
// HOME PAGE (with login links) ========
// =====================================
  
// =====================================
// LOGIN ===============================
// =====================================
// show the login form  
    app.get('/', function(req, res) {
        res.render('index.ejs', { message: req.flash('loginMessage') }); // load the index.ejs file
    });
    
    // process the login form
	app.post('/login', passport.authenticate('local-login-provider', {
		successRedirect   : '/dashboard',     // redirect to the secure profile section
		failureRedirect   : '/accessdenied',  // redirect back to the signup page if there is an error
		failureFlash      : true              // allow flash messages
	}));

// =====================================
// DashBoard SECTION =====================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
  app.get('/dashboard', isLoggedIn, function(req, res) {
    res.render('dashboard.ejs', {
      user : req.user // get the user out of session and pass to template
    });
  });
    
// =====================================
// DashBoard SECTION =====================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
  app.get('/perfil', isLoggedIn, function(req, res) {
    res.render('perfil.ejs', {
      user : req.user // get the user out of session and pass to template
    });
  });

// =====================================
// SIGNUP ==============================
// =====================================
// show the signup form
	app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});
    
    // process the signup form
	app.post('/signup', passport.authenticate('local-signup-provider', {
		successRedirect   : '/dashboard', // redirect to the secure profile section
		failureRedirect   : '/signup',    // redirect back to the signup page if there is an error
		failureFlash      : true          // allow flash messages
	}));
    
// =====================================
// LOGOUT ==============================
// =====================================
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

// =====================================
// Forgot ==============================
// =====================================    
    app.get('/forgot', function(req,res)
        {
        res.render('forgot.ejs');
        });

    app.get('/accessdenied', function(req,res)
        {
        res.render('accessdenied.ejs');
        });

};


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/accessdenied');
}