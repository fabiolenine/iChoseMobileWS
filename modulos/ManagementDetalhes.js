//ManagementDetalhes.js
module.exports = function(mongoose)
{
    var event = require('./EventModel.js');
    
    var scrapevent = function(scrape, callback){ 
        var eventscrap = new event.model(scrape);
        eventscrap.save(function(err,doc){  
            if(err) {callback(false);}
            else    {callback(true);}
        });
    };
    
    var retorno = {"scrapevent"	: scrapevent};

	return retorno;	

}