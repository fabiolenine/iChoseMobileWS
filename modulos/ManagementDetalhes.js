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
    
    var scrapesave = function(scrape, callback) {
        var eventscrape = new event.model(scrape);
        
        eventscrape.save();
        
    };

    var scrapeparttwo = function(scrape){
        var eventscrape = new event.model(scrape);
        
        scrapelink(eventscrape.urlscrapedetalhes, function(html) {
        
            var $ = html;
            
            var extracao                    = $('.desc_basica_evento p span').text().trim();       
            eventscrape.descricao           = extracao;
            
            var xclassificacao              = extracao.search("Classifica��o:") + 18;
            var xabertura                   = extracao.search("Abertura:") + 10;
            var xinicio                     = extracao.search("In�cio:") + 8;
            
            eventscrape.abertura            = extracao.substr(xabertura,5);
            eventscrape.classificacao       = extracao.substr(xclassificacao,7);
            eventscrape.inicio              = extracao.substr(xinicio,5);
            eventscrape.urlpersonaevento    = $('.desc_basica_evento p span').find('a').attr('href');
            
            scrapesave(eventscrape);
            
        });
        
    };
    
    
    var scrapepartone = function(link, callback){
        
        var scrape  = { estabelecimento     : "",
                        evento              : "", 
                        dataevento          : "", 
                        imagembanner        : "", 
                        cidade              : "",
                        uf                  : "",
                        urlscrapedetalhes   : "",
                        abertura            : "",
                        classificacao       : "",
                        inicio              : "",
                        descricao           : "",
                        urlpersonaevento    : "",
                        tags                : []};
        
        scrapelink(link, function(html) {
        
            var $ = html;
        
            scrape.tags = $('.cabecalho .titulo').text().trim();
            var events  = $('.item_evento_1')
            var counter = events.length;
            
            events.each(function(){
                scrape.urlscrapedetalhes   = 'http://www.blueticket.com.br' +  $(this).find('a').attr('href').trim();
                scrape.imagembanner        = $(this).find('img').attr('src').trim();
                scrape.evento              = $(this).find('.titulo_evento_lista').text().trim();
                scrape.estabelecimento     = $(this).find('.desc_evento_lista strong').text().trim();
                var order                  = $(this).find('.desc_evento_lista').text().split("|");
                var city                   = order[1].split("-");
                scrape.cidade              = city[0].trim();
                scrape.uf                  = city[1].trim();
                var dt                     = $(this).find('.data_evento_lista').text().split(",");
                scrape.dataevento          = dt[1].replace(" de Janeiro de ","/01/").replace(" de Fevereiro de ","/02/").replace(" de Março de ","/03/").replace(" de Abril de ","/04/").replace(" de Maio de ","/05/").replace(" de Junho de ","/06/").replace(" de Julho de ","/07/").replace(" de Agosto de ","/08/").replace(" de Setembro de ","/09/").replace(" de Outubro de ","/10/").replace(" de Novembro de ","/11/").replace(" de Dezembro de ","/12/").trim();
            
                scrapeparttwo(scrape);
            
            });
        });
        callback(true);
    };
    
    var scrapeloaddetails = function(){
        event.model.find({},{urlscrapedetalhes: 1},function(error,docs){
            if(error){
                console.log('Erro apresentado: ' + error);
            }
            else {
                for(doc in docs){
                    var url = docs[doc].urlscrapedetalhes;
                    var Id  = docs[doc]._id;
                    
                    console.log(url);
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
                }
            }
        });
    };
    
    var retorno = { "scrapesave"	    : scrapesave,
                    "scrapelink"        : scrapelink,
                    "scrapeloaddetails" : scrapeloaddetails,
                    "scrapepartone"     : scrapepartone,
                    "scrapeparttwo"     : scrapeparttwo};

	return retorno;	

}