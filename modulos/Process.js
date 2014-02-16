module.exports = function(mongoose)
	{
	var evento  			= require('./ProcessLogModel.js');

	//chamar o model e acima fazer um require;



	var retorno =  {
					"registreprocesslog" : registreprocesslog
					};
	
	return retorno;	
	}