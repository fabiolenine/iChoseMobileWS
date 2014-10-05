//ManagementDetalhes.js
module.exports = function(mongoose, request, cheerio)
{
    var event = require('./EventModel.js');
    
    var scrapevent = function(scrape, callback){ 
        
        request({url: scrape.urlscrapedetalhes, enconding: 'binary'}, function(error, response, body){
            if(!error && response.statusCode == 200){
                        
                var $ = cheerio.load(body);
                        
                        //"Cidade/UF: Florian�polis - SCAbertura: 21:00hClassifica��o:  - 16 anos"
                        
                scrape.abertura     = $('.desc_basica_evento p span').text().trim();
        
                var eventscrap = new event.model(scrape);
                eventscrap.save(function(err,doc){  
                    if(err) {callback(false);}
                    else    {callback(true);}
                });
            }
        });
    };
    
    var retorno = {"scrapevent"	: scrapevent};

	return retorno;	

}