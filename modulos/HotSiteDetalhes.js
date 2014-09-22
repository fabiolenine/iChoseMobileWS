//HotSiteDetalhes.js
module.exports = function(config, mongoose, nodemailer, sesTransport)
{
	var emailverao2015 			= require('./EmailVerao2015Model.js');
    var triedemailverao2015 	= require('./TriedEmailVerao2015Model.js');

    
    var envioemail = function(Email, confirmarEmailUrl, cancelarEmailUrl, callback)
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
                            verao.save(function(err,doc) {  if(err) {callback(false);}
                                                            else    {var smtpTransport = nodemailer.createTransport(sesTransport(config.mail));
                                                                     confirmarEmailUrl += '/?account=' + doc._id;
                                                                     cancelarEmailUrl += '/?account=' + doc._id;
smtpTransport.sendMail({from    : 'hello@ichoseapp.com',
                        to      : Email,
                        subject : 'iChose - Verão 2015.',
                        html    : '<p><b>Olá</b>,</p><p>Muito legal você ter fornecido o seu e-mail ao iChose.</p><p><a href="' + confirmarEmailUrl + '" target="_blank">Confirme clicando aqui e participe das promoções e sorteios:</a></p><p>Se você não forneceu o seu email, por favor, cancele a notificação do iChose clicando <a href="' + cancelarEmailUrl + '" target="_blank">aqui</a>.</p><p>Obrigado,</p><p><b>iChose.</b></p>'},function emailverao(error){ if(error) { callback(false);}
								                                    else {callback(true);}                                                                                                       });    
                                                                    }
                                                         });    
						}
					}
				});
		};
    
    	var retorno = {"envioemail"		: envioemail};

	return retorno;	
}