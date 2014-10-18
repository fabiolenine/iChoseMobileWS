//RoutesManagement.js
module.exports = function(app, passport, mongoose, request, cheerio, ManagementDetalhes, EventDetalhes, LocalDetalhes) {

    app.set('views', '../iChoseManagementWeb');
    
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
	app.post('/login', passport.authenticate('local-login-management', {
		successRedirect   : '/dashboard',     // redirect to the secure profile section
		failureRedirect   : '/accessdenied',  // redirect back to the signup page if there is an error
		failureFlash      : true              // allow flash messages
	}));

// =====================================
// DashBoard SECTION ====================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
  app.get('/dashboard', isLoggedIn, function(req, res) {
    res.render('dashboard.ejs', {
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
// Fornecedores SECTION ================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
  app.get('/fornecedorcadastro', isLoggedIn, function(req, res) {
    res.render('fornecedorcadastro.ejs', {
      user : req.user // get the user out of session and pass to template
    });
  });

// =====================================
// Eventos SECTION =====================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
  app.get('/fornecedorevento', isLoggedIn, function(req, res) {
    res.render('fornecedorevento.ejs', {
      user : req.user // get the user out of session and pass to template
    });
  });

  app.get('/event/list', function(req, res) {
      EventDetalhes.list(req.body, function(success){
        res.send(success);
      });
  });    

  app.post('/event/insert', function(req, res) {   
      EventDetalhes.insert(req.body, function(success){
        res.json(success);
        res.send(200);
      });
  });

  app.post('/event/update', function(req, res) {   
      EventDetalhes.update(req.body, function(success){
        if(success){
            res.send(200)
        } 
        else {
            res.send(404)
        };
      });
  });

  app.post('/event/erase/:event_id', function(req, res) {   
      EventDetalhes.erase(req.body, function(success){
        if(success){
            res.send(200)
        } 
        else {
            res.send(404)
        };
      });
  });

// =====================================
// Estados e cidades ===================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
  app.get('/estadosecidades/list', function(req, res) {
      ManagementDetalhes.estadosecidadesList(req.body, function(success){
        res.send(success);
      });
  });    

    
// =====================================
// Locais SECTION ======================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
  app.get('/fornecedorlocal', isLoggedIn, function(req, res) {
    res.render('fornecedorlocal.ejs', {
      user : req.user // get the user out of session and pass to template
    });
  });

  app.get('/local/list', function(req, res) {
      LocalDetalhes.list(req.body, function(success){
        res.send(success);
      });
  });    

  app.post('/local/salvar', function(req, res) {   
      LocalDetalhes.salvar(req.body, function(success){
        res.json(success);
      });
  });

//  app.post('/local/update', function(req, res) {   
//      LocalDetalhes.update(req.body, function(success){
//        if(success){
//            res.send(200)
//        } 
//        else {
//            res.send(404)
//        };
//      });
//  });

  app.post('/local/erase/:local_id', function(req, res) {   
      LocalDetalhes.erase(req.params.local_id, function(success){
        if(success){
            res.send(200)
        } 
        else {
            res.send(404)
        };
      });
  });
    
// =====================================
// Scrape ==============================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
  app.get('/scrape', isLoggedIn, function(req, res) {
        
    ManagementDetalhes.scrapeevent('http://www.blueticket.com.br/?secao=Eventos&tipo=6',function(success){
        if(success){
            res.send(200);
        }
        else {res.send(400);}
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
	app.post('/signup', passport.authenticate('local-signup-management', {
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
// Esquecer ============================
// =====================================    
    app.get('/forgot', function(req,res){
        res.render('forgot.ejs');
        });

    app.get('/accessdenied', function(req,res){
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
