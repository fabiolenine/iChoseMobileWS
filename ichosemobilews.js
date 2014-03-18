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
var mongoose            = require('mongoose');
var express             = require('express');
var passport            = require('passport');
var nodemailer          = require('nodemailer');
var MemoryStore         = require('connect').session.MemoryStore;
var usuariomobile       = require('./modulos/UsuarioMobileModel.js');
var restorepassword	    = require('./modulos/RestorePasswordModel.js');

var app                 = express();

var configmail  =       {
                        mail: require('./config/mail')
                        }

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


app.configure(function()
        {
            app.set('view engine','jade');
            app.use(express.static(__dirname + '/public'));
            app.use(express.bodyParser()); //Evitar o uso desse parser, consultar documentação do ExpressJS;
            app.use(express.cookieParser());
            //app.use(express.json({limit: '300mb'}));
            //app.use(express.urlencoded({limit: '300mb'}));
            app.use(express.session(
                {
                        secret: "iChose secret key", store: new MemoryStore()
                }));
        });

// ------------------------------------------------------------------------
// set up Express routes to handle incoming requests
//
// Express route for all incoming requests
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
        var Condition = { _id: new ObjectID(AccountId)};
    
        console.log('Atualizando foto do ID: ' + req.body.accountid);

// Trecho inicial de teste
        usuariomobile.model.update(Condition,{$set:{'foto':Foto}},{upsert:false},
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
                            res.send(200);
                            //callback(true);
                        }
                    });
// Trecho fim de teste

/*        if(null == AccountId) 
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
app.listen(8080);
console.log('Webserver está escutando na port 8080');

