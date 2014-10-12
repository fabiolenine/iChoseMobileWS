module.exports = function(mongoose)
	{
	var eventmodel  			= require('./EventModel.js');

	//chamar o model e acima fazer um require;

    var list = function(evento, callback){
    
        eventmodel.model.find(function(err, doc){
            if(err){
                callback(err);
            }
            else {
                callback(doc);
            }
        });
    };
    
    var insert = function(evento, callback){
        var event = new eventmodel.model(evento);
        
        event.save(function(err, doc){
            if(err){
                callback(err);
            }
            else {
                callback(doc._id);
            }
        });
    };

    var update = function(evento, callback){
        eventmodel.model.update({
					_id: evento.id
        },{$set: {
            evento //Verificar se é adequado para update.
                }},{
					upsert:false
				    },function updateCallback(err) {
						if(err){
							console.log('Atualização do evento falhou, ID: ' + evento.id);
							callback(false);
						}
						else {
							console.log(': ' + evento.id);
							callback(true);
						}
        });    
    };
    
    var retorno = {"list"	  : list,
                   "insert"   : insert,
                   "update"   : update};

	return retorno;	
	}
