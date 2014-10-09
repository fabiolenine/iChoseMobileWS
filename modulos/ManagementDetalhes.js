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
    
    var scrapeloaddetails = function(callback){
        event.model.find({},{urlscrapedetalhes: 1},function(error,docs){
            if(error){
                console.log('Erro apresentado: ' + error);
            }
            else {
                callback(docs);
//                for(doc in docs){
//                    var url = docs[doc].urlscrapedetalhes;
//                    var Id  = docs[doc]._id;
//                    
//                    scrapelink(url, function(html) {
//        
//                        var $ = html;
//                        
//                        var idade = $('.desc_basica_evento p span strong').text().trim();
//                        
//                        event.model.update({urlscrapedetalhes:url},{$set: {classificacao:idade}},{upsert:false},
//                        function(err){
//						  if(err)
//						  {
//							console.log('Atualização da senha falhou, ID: ' + Id);
//						  }
//						  else
//						  {
//							console.log('Senha alterada do ID de usuário: ' + Id);
//						  }
//					   });                       
//                    });
//                }
            }
        });
    };
    
    var retorno = { "scrapesave"	    : scrapesave,
                    "scrapelink"        : scrapelink,
                    "scrapeloaddetails" : scrapeloaddetails};

	return retorno;	

}