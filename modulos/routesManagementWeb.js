//RoutesManagement.js
module.exports = function(app, passport, mongoose, request, cheerio, ManagementDetalhes) {

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
// Scrape ==============================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
  app.get('/scrape', function(req, res) {
      
    url = 'http://www.blueticket.com.br/?secao=Eventos&tipo=6';
      
	request(url, function(error, response, body){
        
        if(!error && response.statusCode == 200){ 

            var $ = cheerio.load(body);
            
            var estabelecimento, 
                evento, 
                dataevento, 
                usuariocadastroid, 
                imagembanner, 
                cidade,
                uf,
                abertura, 
                inicio, 
                classificacao, 
                descricao, 
                urlyoutube,
                urlpersonaevento,
                urlscrapedetalhes,
                tag = [];
/*
<ul id="fruits">
  <li class="apple">Apple</li>
  <li class="orange">Orange</li>
  <li class="pear">Pear</li>
</ul>
*/
            $('.item_evento_1').each(function(){
                urlscrapedetalhes   = $(this).find('a').attr('href').trim();
                imagembanner        = $(this).find('img').attr('src').trim();
                evento              = $(this).find('.titulo_evento_lista').text().trim();
                estabelecimento     = $(this).find('.desc_evento_lista strong').text().trim();
                dataevento          = $(this).find('.data_evento_lista').text().trim();
                
                urldetalhes = 'http://www.blueticket.com.br' + urlscrapedetalhes;
                
                request(urldetalhes, function(errorD, responseD, bodyD){
                    
                    if(!errorD && responseD.statusCode == 200){
                        
                        var $d = cheerio.load(bodyD);
                        
                        $d('.desc_basica_evento p span').filter(function(){
                            
                            var data = $d(this);
                            console.log('passei');
                            cidade = data.html(); //.children('strong').text().trim();
                        });
                    }
                    
                });
                
                //chamada para salvar o evento.
                console.log('--------------------------');
                console.log(urlscrapedetalhes);
                console.log(imagembanner);
                console.log(evento);
                console.log(estabelecimento);
                console.log(dataevento);
                console.log(cidade);
                
            });
            
        }

    });
      
    res.send(200);
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
