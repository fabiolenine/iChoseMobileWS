//HotSiteDetalhes.js
module.exports = function(config, mongoose, nodemailer)
{
	var emailverao2015 			= require('./EmailVerao2015Model.js');
    var triedemailverao2015 	= require('./TriedEmailVerao2015Model.js');

    
    var envioemail = function(Email, confirmarEmailUrl, callback)
        { 
            //Verificar se o e-mail já foi cadastrado
            //Registrar o novo e-mail
            //Enviar um e-mail de confirmação.
            
			var user = emailverao2015.model.findOne({'email': Email},
				function findemail(err,doc){   if(err) {callback(false);}
					                           else    {
						if(doc){
                            //acrescentar aqui o registro do e-mail no banco e envio
							var triedverao = new triedemailverao2015.model ({ email      : Email
                                                                             //,loc        : {type: 'Point', coordinates:[Lon,Lat]}
													                         });
                            triedverao.save(function(err) { if(err) {
                      						console.log('Erro, ' + err + ', ao tentar salvar a tentativa de envio repetido a conta: ' + Email);}});
							callback(false);
						} 
						else {   
                            var verao = new emailverao2015.model ({   email   : Email,
												                //    loc     : {type: 'Point', coordinates: [Lon,Lat]},
																      utilizou: false 
                                                                    });
                            verao.save(function(err,doc) { if(err) {callback(false);}
                                                            else    {var smtpTransport = nodemailer.createTransport('SES', {AWSAccessKeyID    : "AKIAJKORSFHUALWMOGOA",
                  AWSSecretKey      : "AgYuP3kHPUeCJWyYxVCP/ixk2PKBx4l32D5dnXR9RqJR", 
                  SeviceUrl         : "email-smtp.us-west-2.amazonaws.com"}//config.mail
                                                                                                                   );
                                                                     //confirmarEmailUrl += '/?account=' + doc._id;
						                                             smtpTransport.sendMail({from: 'verao2015@ichose.com.br',
                                                                                             to: 'fabiolenine@gmail.com', //doc.email,
								                                                             subject: 'iChose - Verão 2015.',
								                                                             text: 'Confirme aqui o recebimento do e-mail: ' 
                                                                                             //+ confirmarEmailUrl
                                                                                            },function emailverao(err){ if(err) {callback(false);}
								                         else    {callback(true);}                                                                                                                });    
                                                                    }
                                                         });    
						}
					}
				});
		};
    
    	var retorno = {"envioemail"		: envioemail};

	return retorno;	
}