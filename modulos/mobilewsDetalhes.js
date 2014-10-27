module.exports = function(mongoose)
	{
	var usermobilemodel  = require('./UsuarioMobileModel.js');
    var ObjectID 	     = mongoose.Types.ObjectId;
            
	//chamar o model e acima fazer um require;

    var usermobilecount = function(data, callback){
        usermobilemodel.model.find().count().exec( function(err, doc){
            if(err){
                console.log('Erro na busca dos eventos: ' + err);
            }
            else {
                vjson = {usermobile: doc};
                callback(vjson);
            }
        });
    };    
    
    var retorno = {"usermobilecount": usermobilecount};

	return retorno;	
	
    }