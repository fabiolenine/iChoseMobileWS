//ManagementDetalhes.js
module.exports = function(mongoose, request, cheerio)
{
    var event = require('./EventModel.js');
    
    var scrapelink = function(link, callback){ 
                
        request({url: link, enconding: 'binary'}, function(error, response, body){
            if(!error && response.statusCode == 200){
                        
                var html = cheerio.load(body);
                callback(html);
            }
            else {
                throw error;
            }
        });
    };
    
    var scrapesave = function(scrape) {
        var eventscrap = new event.model(scrape);
        eventscrap.save();       
    };
    
    
    var retorno = { "scrapesave"	: scrapesave,
                    "scrapelink"    : scrapelink};

	return retorno;	

}