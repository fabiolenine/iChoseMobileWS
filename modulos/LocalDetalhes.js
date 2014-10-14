//LocalDetalhes.js
module.exports = function(mongoose)
	{
	var localmodel  = require('./LocalModel.js');

	//chamar o model e acima fazer um require;

    var list = function(local, callback){
    
        localmodel.model.find(function(err, doc){
            if(err){
                console.log('Erro na busca dos locais');
            }
            else {
                callback(doc);
            }
        });
    };
    
    var insert = function(local, callback){
        var vlocal = new eventmodel.model(local);
        
        vlocal.save(function(err, doc){
            if(err){
                callback(err);
            }
            else {
                callback(doc._id);
            }
        });
    };

    var update = function(local, callback){
        localmodel.model.update({
					_id: local.id
        },{$set: 
            local //Verificar se é adequado para update.
                
          },{
             upsert:false
            },function updateCallback(err) {
						if(err){
							console.log('Atualização do local falhou, ID: ' + evento.id);
							callback(false);
						}
						else {
							console.log(': ' + local.id);
							callback(true);
						}
        });    
    };
    
    var erase = function(local, callback){
        localmodel.model.update({
					_id: local.id
        },{$set: 
           {forauso: true} 
          },{
             upsert:false
            },function updateCallback(err) {
						if(err){
							console.log('Atualização do local falhou, ID: ' + evento.id);
							callback(false);
						}
						else {
							console.log(': ' + local.id);
							callback(true);
						}
        });    
    };
    
    var retorno = {"list"	  : list,
                   "insert"   : insert,
                   "update"   : update,
                   "erase"    : erase};

	return retorno;	
	}
