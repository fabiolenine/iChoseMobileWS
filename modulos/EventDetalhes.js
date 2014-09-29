module.exports = function(mongoose)
	{
	var evento  			= require('./EventModel.js');

	//chamar o model e acima fazer um require;



    var retorno = {"eventoscrape"	: eventoscrape};

	return retorno;	
	}
