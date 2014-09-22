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
                        html    : '<!DOCTYPE html>
<html lang="pt-br">
    <head>
    	<!-- Meta, title, CSS, favicons, etc. -->
    	<!--<meta charset="iso-8859-1"/> -->
    	<meta charset="utf-8"/>
    	<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    	<meta name="viewport" content="width=device-width, initial-scale=1"/>
    	<meta name="keywords" content="ichose, provider, baladas, eventos, festas, shows, comanda, digital, danceteria, software, balcão"/>
    	<meta name="author" content="Fabio Lenine, Jadson Mezzari, Jesualdo Pinheiro and Lucas Assis."/>
        
        <link rel="author"                      href="https://google.com/+FabioLenine"/>
        <link rel="stylesheet"                  href= "http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css" >       
        <link rel="stylesheet"                  href="https://s3-us-west-2.amazonaws.com/ichose/site/hotsite/css/normalize.min.css" >
        <link rel="stylesheet"      href="https://s3-us-west-2.amazonaws.com/ichose/site/hotsite/css/main.css">
        <title>iChose - verão 2014/2015</title>
    </head>
    <body>	 	
			<div class="row-fluid clearfix">
				<div class="col-md-4 column">
				</div>
			    <div class="col-md-4 column" id="glass">
			        <h3>Olá,</h3>
			        <h4>Muito legal você ter fornecido o seu e-mail ao iChose.</h4>
			        <a href="' + confirmarEmailUrl + '" target="_blank">
                        <h4>Confirme clicando aqui e participe das promoções e sorteios.</h4>
                    </a>
                    <h4>Se você não fez esta mudança e acredita que sua conta do Twitter foi comprometida, por favor contate o suporte do Twitter clicando <a href="' + cancelarEmailUrl + '" target="_blank">aqui</a>.</h4>
                    <h4>Obrigado,</h4>
                    <h4>iChose</h4>
		        </div>
				<div class="col-md-4 column">
			    </div>
            </div>
    <footer>
        <ul class="footer-area">
            <li>
                <img src="https://s3-us-west-2.amazonaws.com/ichose/site/hotsite/img/logo_desc_footer.png" />
            </li>
            <li>
                <a href="mailto:hello@ichose.com.br" target="_blank">hello@ichose.com.br</a>
                <span>+55 48 8822 9472</span>
            </li>
            <li>
                <a href="https://www.facebook.com/ichoseapp" target="_blank">
                    <img src="https://s3-us-west-2.amazonaws.com/ichose/site/hotsite/img/facebook.png" />
                </a>
                <a href="https://twitter.com/ichoseapp" target="_blank">
                    <img src="https://s3-us-west-2.amazonaws.com/ichose/site/hotsite/img/twitter.png" />
                </a>
                <a href="https://plus.google.com/105051016492501659885" rel="publisher">Google+</a>
            </li>
        </ul>
    </footer>

        </body>'
                        },function emailverao(error){ if(error) {   console.log(error);
                                                                callback(false);}
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