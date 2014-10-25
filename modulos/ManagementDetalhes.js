//ManagementDetalhes.js
module.exports = function(mongoose, request, cheerio)
{
    var eventmodel          = require('./EventModel.js');
    var localmodel          = require('./LocalModel.js');
    var estadoscidadesmodel = require('./EstadosCidadesModel.js');
    var providermodel       = require('./ProviderModel.js');
    var iconv               = require('iconv-lite');
    
    var scrapelink = function(link, callback){ 
        //<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
        request({url: link, enconding: null}, function(error, response, body){
            if(!error && response.statusCode == 200){
                var utf8String = iconv.decode(new Buffer(body),"UTF8");
                var html = cheerio.load(utf8String);
                callback(html);
            }
            else {
                throw error;
            }
        });
    };
    
    var scrapesave = function(event, local, callback) {
        var eventscrape = new eventmodel.model(event);
        var localscrape = new localmodel.model(local);
        var ObjectID 	= mongoose.Types.ObjectId;
        
        var localf = localmodel.model.findOne({
					'estabelecimento'  : localscrape.estabelecimento,
                    'cidade'           : localscrape.cidade
				},
				function findestabelecimento(err,doc){
					if (err){
						callback(false);
					}
					else {
						if (doc){                    
                            
                            eventscrape.estabelecimentoid = new ObjectID(doc._id);
                            
                            console.log(eventscrape.dataevento);
                            console.log(new Date(eventscrape.dataevento));
                                        
                            var eventf = eventmodel.model.findOne({
                                'evento'            : eventscrape.evento,
                                'dataevento'        : new Date(eventscrape.dataevento),
                                'estabelecimentoid' : doc._id},
                                function findevento(err,doc){
                                    if(err){
                                        callback(false);
                                    } 
                                    else {
                                        if(!doc){eventscrape.save();}
                                    }
                                });
                        }
                        else {
                            localscrape.save(function savelocal(err,doc){
                                eventscrape.estabelecimentoid = new ObjectID(doc._id);
                                eventscrape.save();
                            });
                        }
                    }
        });
    };

    var scrapeparttwo = function(scrape){
        var eventscrape = new eventmodel.model(scrape);
        var local       = { estabelecimento    : "",
					        fornecedorid       : "",
                            usuariocadastroid  : "",
                            imagembanner       : "",
                            logradouro         : "",
                            complemento        : "",
                            bairro             : "",
                            cidade             : "",
                            estado             : "",
                            email              : "",
                            telefone           : "",
                            website            : "",
                            situacao           : ""};
        
        
        scrapelink(eventscrape.urlscrapedetalhes, function(html) {
        
            var $ = html;
            var latitude  = -35.717680;
            var longitude = -9.644430;
            
            var extracao                = $('.desc_basica_evento p span').text().trim();       
            var cidadeext               = $('.desc_basica_evento p span').first().text();
            
            var xclassificacao          = extracao.search("Classifica��o:") + 18;
            var xabertura               = extracao.search("Abertura:") + 10;
            var xinicio                 = extracao.search("In�cio:") + 8;
            var xcidade                 = extracao.search('Cidade/UF') 
            
            eventscrape.abertura        = extracao.substr(xabertura,5);
            eventscrape.classificacao   = extracao.substr(xclassificacao,7);
            if(xinicio > 8){
                eventscrape.inicio = extracao.substr(xinicio,5);
            }
            eventscrape.website         = $('.desc_basica_evento p span').find('a').attr('href');
            eventscrape.descricao       = $('.desc_completa_evento .caixa_texto .scroll-pane').text();
            
            local.imagembanner         = $('.div_img a').find('img').attr('src');
            local.estabelecimento      = $('.desc_interna_azul').text().trim();
            local.logradouro           = $('.local_evento p').eq(1).text().replace('Endere�o' , '').replace(/\t/g , '').replace(/\n/g , '').replace(/\r/g , ',').trim();
            var city                   = cidadeext.replace('Cidade/UF:','').trim().split('-');        
            local.cidade               = city[0].trim();
            local.estado               = city[1].trim();
            local.website              = $('.local_evento p').find('a').attr('href');
            local.loc                  = {type: 'Point', coordinates: [longitude,latitude]};
            
            $('.thead_titulo').each(function (){
                var vgenero = $(this).find('.titulo_laranja').text().trim();
                
                eventscrape.ingresso.push({genero: vgenero});
                
            });
            
            scrapesave(eventscrape,local);
            
        });
        
    };
    
    
    var scrapeevent = function(link, callback){
        
        var event  = {  estabelecimentoid   : "",
                        evento              : "", 
                        dataevento          : "", 
                        imagembanner        : "",
                        urlscrapedetalhes   : "",
                        abertura            : "",
                        classificacao       : "",
                        inicio              : "",
                        descricao           : "",
                        website             : "",
                        descricao           : "",
                        tags                : [],
                        ingresso            : [{genero  : ""
                                                //,produto : [{setor : "",
                                                  //           valor : ""}]
                                               }]};
        
        scrapelink(link, function(html) {
        
            var $ = html;
        
            event.tags = $('.cabecalho .titulo').text().trim();
            var events  = $('.item_evento_1')
            
            events.each(function(){
                event.urlscrapedetalhes   = 'http://www.blueticket.com.br' +  $(this).find('a').attr('href').trim();
                event.imagembanner        = $(this).find('img').attr('src').trim();
                event.evento              = $(this).find('.titulo_evento_lista').text().trim();
                event.estabelecimento     = $(this).find('.desc_evento_lista strong').text().trim();
                var dt                    = $(this).find('.data_evento_lista').text().split(",");
                if(dt[1]){
                event.dataevento          = dt[1].replace(" de Janeiro de ","/01/").replace(" de Fevereiro de ","/02/").replace(" de Março de ","/03/").replace(" de Abril de ","/04/").replace(" de Maio de ","/05/").replace(" de Junho de ","/06/").replace(" de Julho de ","/07/").replace(" de Agosto de ","/08/").replace(" de Setembro de ","/09/").replace(" de Outubro de ","/10/").replace(" de Novembro de ","/11/").replace(" de Dezembro de ","/12/").trim();
                }
                
                scrapeparttwo(event);
            
            });
        });
        callback(true);
    };
    
    var estadosecidadesList = function(local, callback){
        estadoscidadesmodel.model.find(function(err, doc){
            if(err){
                console.log('Erro na busca dos locais');
            }
            else {
                callback(doc);
            }
        });
    };

    var providerList = function(local, callback){
        providermodel.model.find(function(err, doc){
            if(err){
                console.log('Erro na busca dos locais');
            }
            else {
                callback(doc);
            }
        });
    };
    
    var retorno = { "scrapesave"	       : scrapesave,
                    "scrapelink"           : scrapelink,
                    "scrapeevent"          : scrapeevent,
                    "scrapeparttwo"        : scrapeparttwo,
                    "estadosecidadesList"  : estadosecidadesList,
                    "providerList"         : providerList
                  };

	return retorno;	

}