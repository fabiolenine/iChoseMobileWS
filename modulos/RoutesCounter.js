//RoutesCounter.js
module.exports = function(app, passport) {

    app.set('views', '../iChoseCounter');
    
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
	app.post('/login', passport.authenticate('local-login', {
		successRedirect   : '/terminal',     // redirect to the secure profile section
		failureRedirect   : '/accessdenied',  // redirect back to the signup page if there is an error
		failureFlash      : true              // allow flash messages
	}));

// =====================================
// Terminal SECTION ====================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
  app.get('/terminal', isLoggedIn, function(req, res) {
    res.render('terminal.ejs', {
      user : req.user // get the user out of session and pass to template
    });
  });
    
// =====================================
// Perfil SECTION =====================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
  app.get('/perfil', isLoggedIn, function(req, res) {
    res.render('perfil.ejs', {
      user : req.user // get the user out of session and pass to template
    });
  });

// =====================================
// Vendas SECTION ============+=========
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
  app.get('/sales', isLoggedIn, function(req, res) {
    res.render('sales.ejs', {
      user : req.user // get the user out of session and pass to template
    });
  });

// =====================================
// Atendimentos SECTION ================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
  app.get('/attendances', isLoggedIn, function(req, res) {
    res.render('attendances.ejs', {
      user : req.user // get the user out of session and pass to template
    });
  });
    
// =====================================
// Consultar SECTION ===================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
  app.get('/consult', isLoggedIn, function(req, res) {
    res.render('consult.ejs', {
      user : req.user // get the user out of session and pass to template
    });
  });

// =====================================
// Pagamento SECTION ===================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
  app.get('/payment', isLoggedIn, function(req, res) {
    res.render('payment.ejs', {
      user : req.user // get the user out of session and pass to template
    });
  });

// =====================================
// Produtos e Servicos SECTION =========
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
  app.get('/productsandservices', isLoggedIn, function(req, res) {
    res.render('productsandservices.ejs', {
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
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect   : '/terminal', // redirect to the secure profile section
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
// Esquecer ============================
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
