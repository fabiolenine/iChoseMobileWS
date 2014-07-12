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
var cons                = require('consolidate');
var flash               = require('connect-flash');
var morgan              = require('morgan');
var cookieParser        = require('cookie-parser');
var bodyParser          = require('body-parser');
var session             = require('express-session');
var vhost               = require('vhost');
//var MemoryStore         = require('connect').session.MemoryStore;
var MemoryStore         = require('connect').session;
var usuariomobile       = require('./modulos/UsuarioMobileModel.js');
var restorepassword	    = require('./modulos/RestorePasswordModel.js');

var app                 = express();
var appProvider         = express();

app.use(vhost('provider.ichose.com.br',appProvider));

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

var account               = require('./modulos/Account.js')(configmail, mongoose, nodemailer);
//Implementar as rotas e as funções antes de liberar.
//var evento              = require('./modulos/Event.js')(mongoose);
//var processo            = require('./modulos/Process.js')(mongoose);

var ObjectID 		      = mongoose.Types.ObjectId;

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

// require('./config/passport')(passport); // pass passport for configuration

// set up ejs for templating
app.set('view engine','ejs');
appProvider.set('view engine', 'ejs');

// set up our express application
app.use(morgan('dev'));     //log every request to the console
app.use(cookieParser());    // read cookies (need for auth)
app.use(bodyParser.json()); //get information from html forms
app.use(bodyParser.urlencoded({extended: true}));

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' }));  // session secret
app.use(passport.initialize());
app.use(passport.session());                                     // persistent login sessions
app.use(flash());                                                // use connect-flash for flash messages stored in session

// routes
require('./modulos/routesWS.js')(app, passport); // load our routes and pass in our app and fully configured passport

require('./modulos/routesProvider.js')(appProvider, passport); // load our routes and pass in our app and fully configured passport

//---------------------------------------------------------------------------------------

//app.configure(function()
//        {
//
//            app.set('view engine','jade');
//            app.use(express.static(__dirname + '/public'));
//            app.use(express.bodyParser({ limite : '300mb '})); //Evitar o uso desse parser, consultar documentação do ExpressJS;
//            app.use(express.cookieParser());
//            app.use(express.json({limit: '300mb'}));
//            app.use(express.urlencoded({limit: '300mb'}));
//            app.use(express.session(
//                {
//                        secret: "iChose secret key", store: new MemoryStore()
//                }));
//        });

// ------------------------------------------------------------------------
// Roteamento dos sites do ecosistema iChose.
//
// roteamento do hotsite
app.get('/', function(req,res)
        {
        res.send('localhost funcionou na porta 80');
        });

appProvider.get('/dashboard/', function(req,res)
        {
        appProvider.set('views', '../ichoseprovider');
        res.render('dashboard.ejs');
        });

appProvider.get('/verao2015/', function(req,res)
        {
        appProvider.set('views', __dirname+'/ichosehotsite/iChoseWebSite');
        var ua = req.headers['user-agent'].toLowerCase();
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(ua)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(ua.substr(0,4)))
            {
                res.render('mverao2015.ejs');
            }
        else
            {
                res.render('verao2015.ejs');
            }
        });

// ------------------------------------------------------------------------
// set up Express routes to handle incoming requests
//
// roteamento do serviçoweb
app.get('/api/', function(req,res)
        {
        res.send('Olá Sam Bell, estou aqui para lhe ajudar!');
        });


// ------------------------------------------------------------------------
// Início das rotas para a área de negocio do Usuário.
// ------------------------------------------------------------------------


app.post('/api/v01/usuariomobile/cadastrar', function(req, res)
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

app.post('/api/v01/usuariomobile/atualizafoto', function(req, res)
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

app.post('/api/v01/usuariomobile/acesso', function(req, res)
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

app.post('/api/v01/usuariomobile/esqueceu', function(req, res)
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

app.get('/api/v01/usuariomobile/restaurar', function(req, res)
        {
        var AccountId = req.param('account',null);
		var id = {ID: AccountId};
		res.render('resetPassword.jade',id);
        });

app.post('/api/v01/usuariomobile/restaurar', function(req, res)
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

app.get('/api/v01/usuariomobile/recuperarusuario', function(req, res)
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
