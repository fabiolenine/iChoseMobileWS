//routesManagementWeb.js
module.exports = function(app, passport, mongoose, request, cheerio, ManagementDetalhes, EventDetalhes, LocalDetalhes, ProviderDetalhes, hotsitedetalhes, mobilewsDetalhes) 
{
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

  app.get('/dashboard/saccount', function(req, res) {
      hotsitedetalhes.saccount(req.body, function(success){
        res.send(success);
      });
  });    
    
  app.get('/dashboard/eventcount', function(req, res) {
      EventDetalhes.eventcount(req.body, function(success){
        res.send(success);
      });
  });

  app.get('/dashboard/usermobilecount', function(req, res) {
      mobilewsDetalhes.usermobilecount(req.body, function(success){
        res.send(success);
      });
  });
    
  app.get('/dashboard/emailveraocount', function(req, res) {
      hotsitedetalhes.emailveraocount(req.body, function(success){
        res.send(success);
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

  app.post('/event/salvar', function(req, res) {   
      EventDetalhes.salvar(req.body, function(success){
        res.json(success);
      });
  });

  app.post('/event/erase/:erase_id', function(req, res) {   
      EventDetalhes.erase(req.params.erase_id, function(success){
        if(success){
            res.send(200);
        } 
        else {
            res.send(404);
        }
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
// Cargo ===============================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
  app.get('/cargos', isLoggedIn, function(req, res) {
    res.render('cargos.ejs', {
      user : req.user // get the user out of session and pass to template
    });
  });
    
  app.get('/cargos/list', function(req, res) {
      ManagementDetalhes.cargoList(req.body, function(success){
        res.send(success);
      });
  }); 

  app.post('/cargos/salvar', function(req, res) {   
      ManagementDetalhes.cargoSalvar(req.body, function(success){
        res.json(success);
      });
  });

  app.post('/cargos/erase/:erase_id', function(req, res) {   
      ManagementDetalhes.cargoErase(req.params.erase_id, function(success){
        if(success){
            res.send(200);
        } 
        else {
            res.send(404);
        }
      });
  });

// =====================================
// Tags ================================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
  app.get('/tags', isLoggedIn, function(req, res) {
    res.render('tags.ejs', {
      user : req.user // get the user out of session and pass to template
    });
  });
    
  app.get('/tags/list', function(req, res) {
      ManagementDetalhes.tagList(req.body, function(success){
        res.send(success);
      });
  }); 

  app.post('/tags/salvar', function(req, res) {   
      ManagementDetalhes.tagSalvar(req.body, function(success){
        res.json(success);
      });
  });

  app.post('/tags/erase/:erase_id', function(req, res) {   
      ManagementDetalhes.tagErase(req.params.erase_id, function(success){
        if(success){
            res.send(200);
        } 
        else {
            res.send(404);
        }
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

  app.get('/local/locallist', function(req, res) {
      LocalDetalhes.locallist(req.body, function(success){
        res.send(success);
      });
  });    

  app.post('/local/salvar', function(req, res) {   
      LocalDetalhes.salvar(req.body, function(success){
        res.json(success);
      });
  });

  app.post('/local/erase/:erase_id', function(req, res) {   
      LocalDetalhes.erase(req.params.erase_id, function(success){
        if(success){
            res.send(200);
        } 
        else {
            res.send(404);
        }
      });
  });
    
    
// =====================================
// Provider Cadastro ===================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
  app.get('/fornecedorcadastro', isLoggedIn, function(req, res) {
    res.render('fornecedorcadastro.ejs', {
      user : req.user // get the user out of session and pass to template
    });
  });

  app.get('/fornecedor/list', function(req, res) {
      ProviderDetalhes.list(req.body, function(success){
        res.send(success);
      });
  });    

  app.get('/fornecedor/providerlist', function(req, res) {
      ProviderDetalhes.providerlist(req.body, function(success){
        res.send(success);
      });
  }); 

  app.post('/fornecedor/salvar', function(req, res) {   
      ProviderDetalhes.salvar(req.body, function(success){
        res.json(success);
      });
  });

  app.post('/fornecedor/erase/:erase_id', function(req, res) {   
      ProviderDetalhes.erase(req.params.erase_id, function(success){
        if(success){
            res.send(200);
        } 
        else {
            res.send(404);
        }
      });
  });
      
// =====================================
// Provider Users ======================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
  app.get('/fornecedorusuario', isLoggedIn, function(req, res) {
    res.render('fornecedorusuario.ejs', {
      user : req.user // get the user out of session and pass to template
    });
  });
    
    app.get('/fornecedor/userlist', function(req, res) {
      ProviderDetalhes.userlist(req.body, function(success){
        res.send(success);
      });
  });    

  app.post('/fornecedor/usersalvar', function(req, res) {   
      ProviderDetalhes.usersalvar(req.body, function(success){
        res.json(success);
      });
  });

  app.post('/fornecedor/usererase/:erase_id', function(req, res) {   
      ProviderDetalhes.usererase(req.params.erase_id, function(success){
        if(success){
            res.send(200);
        } 
        else {
            res.send(404);
        }
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
};