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

        if(!error && response.statuscode === 200){ 

            var $ = cheerio.load(body);
            
            var estabelecimento, 
                evento, 
                dataevento, 
                fornecedorid, 
                esteblecimentoid, 
                usuariocadastroid, 
                imagembanner, 
                abertura, 
                inicio, 
                classificacao, 
                descricao, 
                urlyoutube, 
                urlscrapedetalhes,
                tag = [],
                lista = [];
            
			var json = {estabelecimento    : "",
					    evento             : "",
					    dataevento         : "",
                        fornecedorid       : "",
                        esteblecimentoid   : "",
					    usuariocadastroid  : "",
					    imagembanner       : "",
                        abertura           : "", 
                        inicio             : "",
                        classificacao      : "",
                        descricao          : "",
                        urlyoutube         : "",
                        urlscrapedetalhes  : "",
                        tag                : []};
            
            $('span .titulo_evento_lista').each(function(i,elem) {
              
                evento = $(this).text();
                
                json.evento = evento;
                
                lista.unshift(json);
            });

            console.log(lista);
              
            res.send(lista);
            
/*            
<ul id="fruits">
  <li class="apple">Apple</li>
  <li class="orange">Orange</li>
  <li class="pear">Pear</li>
</ul>
            
            // Finally, we'll define the variables we're going to capture

			
            
        // We'll use the unique header class as a starting point.

        $('.titulo_evento_lista').filter(function(){

           // Let's store the data we filter into a variable so we can easily see what's going on.

		        var data = $(this);

           // In examining the DOM we notice that the title rests within the first child element of the header tag. 
           // Utilizing jQuery we can easily navigate and get the text by writing the following code:

		        evento = data.children().first().text();

           // Once we have our title, we'll store it to the our json object.

		        json.evento = evento;
	       });
            
        $('.data_evento_lista').filter(function(){

           // Let's store the data we filter into a variable so we can easily see what's going on.

		        var data = $(this);

           // In examining the DOM we notice that the title rests within the first child element of the header tag. 
           // Utilizing jQuery we can easily navigate and get the text by writing the following code:

		        dataevento = data.children().first().text();

           // Once we have our title, we'll store it to the our json object.

		        json.dataevento = dataevento;
	       });
            
        $('src').filter(function(){

           // Let's store the data we filter into a variable so we can easily see what's going on.

		        var data = $(this);

           // In examining the DOM we notice that the title rests within the first child element of the header tag. 
           // Utilizing jQuery we can easily navigate and get the text by writing the following code:

		        imagembanner = data.attr();

           // Once we have our title, we'll store it to the our json object.

		        json.imagembanner = imagembanner;
	       });
            
        console.log(json);
*/       
       }

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
