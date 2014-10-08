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
    
    var scrape  = { estabelecimento     : "",
                    evento              : "", 
                    dataevento          : "", 
                    imagembanner        : "", 
                    cidade              : "",
                    uf                  : "",
                    abertura            : "", 
                    inicio              : "", 
                    classificacao       : "", 
                    descricao           : "", 
                    urlyoutube          : "",
                    urlpersonaevento    : "",
                    urlscrapedetalhes   : "",
                    tags                : []};
      
    ManagementDetalhes.scrapelink('http://www.blueticket.com.br/?secao=Eventos&tipo=6', function(html) {
        
        var $ = html;
        
        scrape.tags = $('.cabecalho .titulo').text().trim();
                
        $('.item_evento_1').each(function(){
            scrape.urlscrapedetalhes   = 'http://www.blueticket.com.br' +  $(this).find('a').attr('href').trim();
            scrape.imagembanner        = $(this).find('img').attr('src').trim();
            scrape.evento              = $(this).find('.titulo_evento_lista').text().trim();
            scrape.estabelecimento     = $(this).find('.desc_evento_lista strong').text().trim();
            var order                  = $(this).find('.desc_evento_lista').text().split("|");
            var city                   = order[1].split("-");
            scrape.cidade              = city[0].trim();
            scrape.uf                  = city[1].trim();
            var dt                     = $(this).find('.data_evento_lista').text().split(",");
            var dte                    = dt[1].replace(" de Janeiro de ","/01/").replace(" de Fevereiro de ","/02/").replace(" de Março de ","/03/").replace(" de Abril de ","/04/").replace(" de Maio de ","/05/").replace(" de Junho de ","/06/").replace(" de Julho de ","/07/").replace(" de Agosto de ","/08/").replace(" de Setembro de ","/09/").replace(" de Outubro de ","/10/").replace(" de Novembro de ","/11/").replace(" de Dezembro de ","/12/").trim();
            scrape.dataevento          = Date.parseDate(dte,'d/m/Y');
            
        ManagementDetalhes.scrapesave(scrape);           
        });
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
