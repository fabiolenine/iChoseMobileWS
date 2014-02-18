module.exports = function(config, mongoose, nodemailer)
	{
	var crypto 			= require('crypto');
	var usuariomobile 		= require('./UsuarioMobileModel.js');
	var restorepassword 		= require('./RestorePasswordModel.js');
	var triedrestorepassword 	= require('./TriedRestorePasswordModel.js');

	//chamar o model e acima fazer um require;

	var changePassword = function(accountId, newpassword, callback)
		{
			var shaSum = crypto.createHash('sha256');
			shaSum.update(newpassword);
			var hashedPassword = shaSum.digest('hex');
			usuariomobile.model.update(
				{
					_id:accountId
				},
				{
					$set: 
						{
						senha:hashedPassword
						}
				},
				{
					upsert:false
				},
				function changePasswordCallback(err) 
					{
						if(err)
						{
							console.log('Atualização da senha falhou, ID: ' + accountId);
							callback(false);
						}
						else
						{
							console.log('Senha alterada do ID de usuário: ' + accountId);
							callback(true);
						}
					});
		};

	var forgotPassword = function(Email, Lon, Lat, resetPasswordUrl, callback)
		{ 
			var user = usuariomobile.model.findOne(
				{
					'email': Email
				},
				function findAccount(err,doc)
				{
					if (err)
					{
						//Endereço de email não é um usuário válido.
						callback(false);
					}
					else
					{
						if (doc)
						{
						var smtpTransport = nodemailer.createTransport('SMTP', config.mail);
						resetPasswordUrl += '/?account=' + doc._id;
						smtpTransport.sendMail(
							{
								from: 'recuperarsenha@ichose.com.br',
								to: doc.email,
								subject: 'iChose - Solicitação para restaurar senha.',
								text: 'Click aqui para restaurar a sua senha: ' + resetPasswordUrl
							},
							function forgotPasswordResult(err)
							{
								if (err)
								{
									callback(false);
								}
								else
								{
									var restore = new restorepassword.model ({	
                                                            								usuarioid: 	doc._id, 
                                                            								email: 		Email,
															loc: 		{type: 'Point', coordinates: [Lon,Lat]},
															utilizou: 	false 
                               											});
                                            	                	restore.save(function(err)
                                                	            	{
                                                        	    		if (err)
                                                            			{
                                                            				console.log('Não foi possível salvar a solicitação de renocação senha.');
                                                            				callback(false);
                                                            			}
                                                            			else
                                                            			{
                                                            				callback(true);
                                                            			}
                                                            		});
								}
							});
						} 
						else 
						{
							var triedrestore = new triedrestorepassword.model ({
                                        	  								email: 	Email,
														loc: 	{type: 'Point', coordinates:[Lon,Lat]}
													});
                                	            	triedrestore.save(function(err)
                             					{
                                     				if (err)
                              					{
                      						console.log('Erro, ' + err + ', ao tentar salvar a tentativa de restauração de senha sem existir a conta: ' + Email);
                              					}
                              					});
							console.log(Lon);
							console.log(Lat);
							console.log('Não existe o email: ' + Email + ', para realizar a restauração.');
							callback(false);
						}
					}
				});
		};

	var recuperarusuario = function(email, password, callback)
		{
			usuariomobile.model.findOne(
				{
					'email': email,
					'senha': password
				},
				function(err,doc)
				{
					callback(doc);
				});
		};

	var register = function(Email, Senha, Nomeprincipal, Sobrenome, Genero, CPF, Datanascimento, Celular, CEP, Foto, callback)
		{
			console.log('Cadastrando: ' + Email);
			var usuario = new usuariomobile.model ({   nomecompleto: 	{ 	nomeprincipal:  Nomeprincipal,
                                                        					sobrenome:      Sobrenome
                                                        				},
                                        				genero:         Genero,
                                        				cpf:            CPF,
                                        				datanascimento: Datanascimento,
                                        				celular:        Celular,
                                        				cep:            CEP,
                                        				email:          Email,
                                        				senha:          Senha,
									foto:		Foto
								});
			usuario.save(function(err)
					{
						if (err)
							{
								return callback(false);
							}
						usuariomobile.model.findOne(
                                                    {
                                                        'email': Email
                                                    },
                                                    function(erro,identificacao)
                                                        {
                                                            if (identificacao) 
                                                                {
                                                                   callback(identificacao._id);
                                                                }
                                                            else
                                                                {
                                                                   callback(false);
                                                                }
                                                        });
					});
			console.log('Comando para gravar enviado.');
			
		};

	var retorno = {
			"register"		: register,
			"forgotPassword"	: forgotPassword,
			"changePassword"	: changePassword,
			"recuperarusuario"	: recuperarusuario
		};

	return retorno;	
	}
