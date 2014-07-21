//HotSiteDetalhes.js
module.exports = function(config, mongoose, nodemailer)
{
	var usuariomobile 			= require('./EmailVerao2015Model.js');
    
    var forgotPassword = function(Email, Lon, Lat, resetPasswordUrl, callback)
        { 
            //Verificar se o e-mail já foi cadastrado
            //Registrar o novo e-mail
            //Enviar um e-mail de confirmação.
            
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
                            //Acrescentar aqui a finalização.
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
                                 	restore.save(function(err) {
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
                            //acrescentar aqui o registro do e-mail no banco e envio
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
}