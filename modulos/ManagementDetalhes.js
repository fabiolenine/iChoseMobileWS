//ManagementDetalhes.js
module.exports = function(mongoose, request, cheerio)
{
    var event = require('./EventModel.js');
    
    var scrapelink = function(link, callback){ 
        var scrape  = { estabelecimento     : "", 
                        evento              : "", 
                        dataevento          : "", 
                        imagembanner        : "", 
                        cidade              : "",
                        uf                  : "",
                        abertura            : "", 
                        inicio              : "", 
                        classificacao       : "", 
                        descricao           : "", 
                        urlyoutube          : "",
                        urlpersonaevento    : "",
                        urlscrapedetalhes   : "",
                        tags                : []};
        var scrapes = [];
        
        request({url: link, enconding: 'binary'}, function(error, response, body){
            if(!error && response.statusCode == 200){
                        
                var $ = cheerio.load(body);
        
	            scrape.tags.push($('.cabecalho .titulo').text().trim());
            
                $('.item_evento_1').each(function(){
                    scrape.urlscrapedetalhes   = 'http://www.blueticket.com.br' +  $(this).find('a').attr('href').trim();
                    scrape.imagembanner        = $(this).find('img').attr('src').trim();
                    scrape.evento              = $(this).find('.titulo_evento_lista').text().trim();
                    scrape.estabelecimento     = $(this).find('.desc_evento_lista strong').text().trim();
                    var order                  = $(this).find('.desc_evento_lista').text().split("|");
                    var city                   = order[1].split("-");
                    scrape.cidade              = city[0].trim();
                    scrape.uf                  = city[1].trim();
                    var dt                     = $(this).find('.data_evento_lista').text().split(",");
                    scrape.dataevento          = dt[1].replace(" de Janeiro de ","/10/").replace(" de Fevereiro de ","/10/").replace(" de Março de ","/10/").replace(" de Abril de ","/10/").replace(" de Maio de ","/10/").replace(" de Junho de ","/10/").replace(" de Julho de ","/10/").replace(" de Agosto de ","/10/").replace(" de Setembro de ","/10/").replace(" de Outubro de ","/10/").replace(" de Novembro de ","/10/").replace(" de Dezembro de ","/10/").trim();

                    scrapes.push(scrape);
                });
                
                callback(scrapes);    
            }
            else {
                throw error;
            }
        });
    };
    
    var scrapesave = function(scrape, callback) {
        var eventscrap = new event.model(scrape);
        eventscrap.save(function(err,doc){  
            if(err) {callback(false);}
            else    {callback(true);}
                });       
    };
    
    
    var retorno = { "scrapsave"	    : scrapesave,
                    "scrapelink"    : scrapelink};

	return retorno;	

}