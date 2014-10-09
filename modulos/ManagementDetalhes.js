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
    
    var scrapeloaddetails = function(){
        event.model.find({},{urlscrapedetalhes: 1},function(error,docs){
            if(error){
                console.log('Erro apresentado: ' + error);
            }
            else {
                for(doc in docs){
                    var url = docs[doc].urlscrapedetalhes;
                    request(url, function(err, resp, body) {
                    if (err) throw err;
                    
                    $ = cheerio.load(body);
                    console.log(url);
                        // TODO: scraping goes here!
                    });
            }
        });
    };
    
    var retorno = { "scrapesave"	    : scrapesave,
                    "scrapelink"        : scrapelink,
                    "scrapeloaddetails" : scrapeloaddetails};

	return retorno;	

}