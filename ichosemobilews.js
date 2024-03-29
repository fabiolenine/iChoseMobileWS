/**
 * app.js
 *
 * @version 0.1 - Beta
 *
 * DESCRIPTION:
 * Serviço WEB do aplicativo iChose.
 * Webserver and a mongo DB on separate instances on AWS EC2.
 * Uses the Express and Mongoose node packages.
 *
 *
 * @ichoseapp
 * @see ichoseapp.com
 * @see ichose.com.br
 * @see ichoseapp.com.br
 *
 * @author Fabio Lenine Vilela da Silva
 * (C) 2014 Florianópolis - Brasil
 */

var http                = require('http');
var https               = require('https');
var mongoose            = require('mongoose');
var express             = require('express');
var passport            = require('passport');
var nodemailer          = require('nodemailer');
var sesTransport        = require('nodemailer-ses-transport');
var cons                = require('consolidate');
var flash               = require('connect-flash');
var morgan              = require('morgan');
var cookieParser        = require('cookie-parser');
var bodyParser          = require('body-parser');
var session             = require('express-session');
var vhost               = require('vhost');
var request             = require('request');
var cheerio             = require('cheerio');
var MemoryStore         = require('connect').session;
var usuariomobile       = require('./modulos/UsuarioMobileModel.js');
var restorepassword	    = require('./modulos/RestorePasswordModel.js');

var app                 = express();
var appProvider         = express();
var appMobileWS         = express();
var appCounter          = express();
var appManagementWeb    = express();

app.use(vhost('provider.ichose.com.br',appProvider));
app.use(vhost('mobilews.ichose.com.br',appMobileWS));
app.use(vhost('counter.ichose.com.br',appCounter));
app.use(vhost('management.ichose.com.br',appManagementWeb));

http.createServer(app).listen(80);
//https.createServer(options,app).listen(443);

var configmail  =       {
                        mail: require('./config/mail')
                        };

var config      =       {
                        "USER"     : "ichoseuser",
                        "PASS"     : "helioenai",
                        "HOST"     : "10.235.39.109",
                        "PORT"     : "27017",
                        "DATABASE" : "dbichose"
                        };

var dbPath  = "mongodb://" +    config.USER + ":" +
                                config.PASS + "@"+
                                config.HOST + ":"+
                                config.PORT + "/"+
                                config.DATABASE;

var db;              // our MongoDb database

var account             = require('./modulos/Account.js')(configmail, mongoose, nodemailer, sesTransport);
var hotsitedetalhes     = require('./modulos/HotSiteDetalhes.js')(configmail, mongoose, nodemailer, sesTransport);
var ManagementDetalhes  = require('./modulos/ManagementDetalhes.js')(mongoose, request, cheerio);
var EventDetalhes       = require('./modulos/EventDetalhes.js')(mongoose);
var LocalDetalhes       = require('./modulos/LocalDetalhes.js')(mongoose);
var ProviderDetalhes    = require('./modulos/ProviderDetalhes.js')(mongoose);
var mobilewsDetalhes    = require('./modulos/mobilewsDetalhes.js')(mongoose);

var ObjectID 		= mongoose.Types.ObjectId;

// ------------------------------------------------------------------------
// Connect to our Mongo Database hosted on another server
//
console.log('\ntentando se conectar a instância MongoDB remoto em outro servidor EC2 '+config.HOST);

if ( !(db = mongoose.connect(dbPath)) ) console.log('Não é possível conectar ao MongoDB em '+dbPath);
else console.log('conexão com o MongoDB em '+dbPath);

// connection failed event handler
mongoose.connection.on('erro: ', function(err)
        {
        console.log('Conexão da base de dados com erro '+err);
        }); // mongoose.connection.on()

// connection successful event handler:
// check if the Db already contains a greeting. if not, create one and save it to the Db
mongoose.connection.once('open', function()
        {
        console.log('database '+config.DATABASE+' está agora aberto em '+config.HOST );
        });

//---------------------------------------------------------------------------------------

require('./config/passport')(passport); // pass passport for configuration

// set up ejs for templating
app.set('view engine','ejs');
appProvider.set('view engine', 'ejs');

// set up our express application
app.use(morgan('dev'));     //log every request to the console
app.use(cookieParser());    // read cookies (need for auth)
app.use(bodyParser.json()); //get information from html forms
app.use(bodyParser.urlencoded({extended: true}));

// required for passport
app.use(session({ secret: 'jacagueiprontoagoravamosfudersuaputa' }));  // session secret
app.use(passport.initialize());
app.use(passport.session());                                     // persistent login sessions
app.use(flash());                                                // use connect-flash for flash messages stored in session

// Declaração de configuração para a rota Provider
// set up our express application
appProvider.use(morgan('dev'));     //log every request to the console
appProvider.use(cookieParser());    // read cookies (need for auth)
appProvider.use(bodyParser.json()); //get information from html forms
appProvider.use(bodyParser.urlencoded({extended: true}));

// required for passport
appProvider.use(session({ secret: 'jacagueiprontoagoravamosfudersuaputa' }));  // session secret
appProvider.use(passport.initialize());
appProvider.use(passport.session());                                     // persistent login sessions
appProvider.use(flash());

// Declaração de configuração para a rota MobileWS
// set up our express application
appMobileWS.use(morgan('dev'));     //log every request to the console
appMobileWS.use(cookieParser());    // read cookies (need for auth)
appMobileWS.use(bodyParser.json()); //get information from html forms
appMobileWS.use(bodyParser.urlencoded({extended: true}));

// required for passport
appMobileWS.use(session({ secret: 'jacagueiprontoagoravamosfudersuaputa' }));  // session secret
appMobileWS.use(passport.initialize());
appMobileWS.use(passport.session());                                     // persistent login sessions
appMobileWS.use(flash());

// Declaração de configuração para a rota Counter
// set up our express application
appCounter.use(morgan('dev'));     //log every request to the console
appCounter.use(cookieParser());    // read cookies (need for auth)
appCounter.use(bodyParser.json()); //get information from html forms
appCounter.use(bodyParser.urlencoded({extended: true}));

// required for passport
appCounter.use(session({ secret: 'jacagueiprontoagoravamosfudersuaputa' }));  // session secret
appCounter.use(passport.initialize());
appCounter.use(passport.session());                                     // persistent login sessions
appCounter.use(flash());

// Declaração de configuração para a rota Counter
// set up our express application
appManagementWeb.use(morgan('dev'));     //log every request to the console
appManagementWeb.use(cookieParser());    // read cookies (need for auth)
appManagementWeb.use(bodyParser.json()); //get information from html forms
appManagementWeb.use(bodyParser.urlencoded({extended: true}));

// required for passport
appManagementWeb.use(session({ secret: 'jacagueiprontoagoravamosfudersuaputa' }));  // session secret
appManagementWeb.use(passport.initialize());
appManagementWeb.use(passport.session());                                     // persistent login sessions
appManagementWeb.use(flash());

// routes
require('./modulos/routesHotSite.js')(app, passport, mongoose, hotsitedetalhes);      // load our routes and pass in our app and fully configured passport

require('./modulos/routesProvider.js')(appProvider, passport);              // load our routes and pass in our app and fully configured passport

require('./modulos/routesMobileWS.js')(appMobileWS, passport, mongoose, mobilewsDetalhes);              // load our routes and pass in our app and fully configured passport

require('./modulos/RoutesCounter.js')(appCounter, passport);                // load our routes and pass in our app and fully configured passport

require('./modulos/routesManagementWeb.js')(appManagementWeb, passport, mongoose, request, cheerio, ManagementDetalhes, EventDetalhes, LocalDetalhes, ProviderDetalhes, hotsitedetalhes, mobilewsDetalhes);    // load our routes and pass in our app and fully configured passport

// ------------------------------------------------------------------------
// Início das rotas para a área de negocio do Usuário.
// ------------------------------------------------------------------------


appMobileWS.post('/api/v01/usuariomobile/cadastrar', function(req, res)
        {
        var nomePrincipal       = req.body.nomecompleto.nomeprincipal;
        var sobreNome           = req.body.nomecompleto.sobrenome;
        var Genero              = req.body.genero;
        var Cpf                 = req.body.cpf;
        var dataNascimento      = req.body.datanascimento;
        var Celular             = req.body.celular;
        var Cep                 = req.body.cep;
        var Email               = req.body.email;
        var Senha               = req.body.senha;
        var Foto                = req.body.foto;

	console.log(req.body.nomecompleto.nomeprincipal);

        if(null == Email || null == Senha )
                {
                        console.log('Tentativa de cadastro com email ou senha nula.')
                        res.send(400);
                }
        else
                {
                        usuariomobile.model.findOne({'email': Email}, function (err, emails)
                        {
                                if (err)
                                        {
                                        console.log('Erro na tentativa de busca para cadastro do email: ' + Email);
                                        res.send(400);
                                        }
                                else
                                        {
                                        if(emails)
                                                {
                                                console.log('Tentativa de cadastro com e-mail existente: ' + Email);
                                                res.send(400);
                                                 }
                                        else
                                                {
                                                account.register(Email, Senha, nomePrincipal, sobreNome, Genero, Cpf, dataNascimento, Celular, Cep, Foto, function(callback)
						{
							if (callback)
							{
								console.log(callback);
								res.send(callback);
							}
							else
							{
								res.send(400);
							}
						});
						}
                                        }
                        });
                }
        });

appMobileWS.post('/api/v01/usuariomobile/atualizafoto', function(req, res)
        {
        var AccountId = req.body.accountid;
        var Foto      = req.body.foto;
        //var Condition = { _id: new ObjectID(AccountId)};

        console.log('Atualizando foto do ID: ' + req.body.accountid);
        console.log('Tamanho: ' + Foto.length);

// Trecho inicial de teste
        var result = usuariomobile.model.findByIdAndUpdate(AccountId.ToString,{'foto':Foto},{upsert:false},
                function(err)
                    {
                        if(err)
                        {
                            console.log('Atualização da foto falhou, ID: ' + AccountId);
                            res.send(400);
                            //callback(false);
                        }
                        else
                        {
                            // Registrar inserção.
                            console.log('Foto alterada, do ID: ' + AccountId);
                            console.log('Tamanho: ' + Foto.length);
                            res.send(200);
                            //callback(true);
                        }
                    });

        console.log(result);
// Trecho fim de teste

/*        if(null == AccountId)
>>>>>>> Issue#5
                {
                    console.log('Tentativa de atualização da foto com id null.')
                    res.send(400);
                }
        else
                {
                    account.atualizarFoto(AccountId, Foto, function(callback)
                    {
                    if (callback)
                        {
                            console.log(callback);
                            res.send(callback);
                        }
                    else
                        {
                            res.send(400);
                        }
                    });
                }
*/        });

appMobileWS.post('/api/v01/usuariomobile/acesso', function(req, res)
        {
                var Email = req.param('email','');
                var Senha = req.param('senha','');
                console.log('Acesso de usuário mobile requerido: ' + Email);
                if (null == Email || Email.length < 5 || null = Senha || Senha.length < 4)
                {
                        res.send(400);
                        return;
                }

                account.login(Email,Senha,function(success)
                {
                        if (!success)
                        {
                                res.send(400);
                                return;
                        }
                        console.log('Acesso autorizado' + Email);
                        res.send(200);
                });
        });

appMobileWS.post('/api/v01/usuariomobile/esqueceu', function(req, res)
        {
                var hostname            = req.headers.host;
                var resetPasswordUrl    = 'http://' + hostname + '/api/v01/usuariomobile/restaurar';
                var Email               = req.body.email;
                var Lon                 = req.body.loc.lon;
                var Lat                 = req.body.loc.lat;

		console.log('Recebi o valor: ' +  Email + ', com longitude: ' + Lon + ' e latitude: ' + Lat);

                if (null == Email || Email.length < 5)
                {
                        res.send(400);
                        return;
                }

                account.forgotPassword(Email, Lon, Lat, resetPasswordUrl, function(success)
                {
                        if (success)
                                {
                                        res.send(200);
                                }
                        else
                                {
                                        res.send(404);
                                }
                });
        });

appMobileWS.get('/api/v01/usuariomobile/restaurar', function(req, res)
        {
        var AccountId = req.param('account',null);
		var id = {ID: AccountId};
		res.render('resetPassword.jade',id);
        });

appMobileWS.post('/api/v01/usuariomobile/restaurar', function(req, res)
        {
        var accountId   = req.param('accountId',null);
        var Senha       = req.param('password',null);
		var condition   = { usuarioid: new ObjectID(accountId), utilizou: false };

		if (null  != accountId && null != Senha)
                        {
                        	restorepassword.model.update(condition,{$set:{utilizou:true}},{upsert:false, multi:true},
                                        function(erro,doc)
                                        {
						if(erro)
						{
						console.log('Não foi possivel atualizar a flag UTILIZOU, houve um erro.');
						}
						else
						{
                                            		if(doc==0)
							{
								//Inserir aqui uma pagina com a mensagem.
								console.log('Não encontrei registro para atualizar a flag UTILIZOU, por favor, solicite novamente a restauraçào de senha.');
								res.send(400);
							}
							else
							{
								account.changePassword(accountId, Senha, function(callback)
                                    				{
                                        				if(callback)
                                        				{
										console.log('Utilização verdadeira, quantidade: ' + doc);
                                            					res.render('resetPasswordSuccess.jade');
									}
									else
									{
										//Inserir aqui uma página com a mensagem.
										console.log('Houve um erro ao tentar alterar a senha, por favor, solicite novamente.');
									}
								});
							}
                                    		}});
                        };
        });

appMobileWS.get('/api/v01/usuariomobile/recuperarusuario', function(req, res)
        {
        var Email               = req.param('email','');
        var Senha               = req.param('senha','');

        console.log(req.param('email',''));

        if(null == Email || null == Senha )
                {
                        console.log('Tentativa de cadastro com email ou senha nula.')
                        res.send(400);
                }
        else
                {
                        account.recuperarusuario(Email, Senha, function(callback)
                        {
                            if (callback)
                                    {
                                        res.json(200,callback);
                                    }
                            else
                                    {
                                        console.log('Usuário: ' + Email + ' não encontrado.');
                                        res.send(400);
                                    }
                        });
                }
        });

// ------------------------------------------------------------------------
// Início das rotas para a área de negocio das Baladas.
// ------------------------------------------------------------------------


// ------------------------------------------------------------------------
// Início das rotas para a área de negocio dos Processos de log e backend.
// ------------------------------------------------------------------------



//
// Express route to handle errors
//
app.use(function(err, req, res, next)
        {
        if (req.xhr)
                {
                res.send(500, 'Algo deu errado Sam!');
                res.end;
                }
        else
                {
                next(err);
                }
        });

// ------------------------------------------------------------------------
// Start Express Webserver
//
console.log('Iniciando o Web server iChose');
//app.listen(8080)
console.log('Webserver está escutando na port 80.');
