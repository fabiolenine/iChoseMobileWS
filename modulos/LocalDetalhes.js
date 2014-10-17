//LocalDetalhes.js
module.exports = function(mongoose)
	{
	var localmodel  = require('./LocalModel.js');
    var ObjectID 	= mongoose.Types.ObjectId;
            
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
    
    var salvar = function(local, callback){ 
        var vlocal = new localmodel.model(local);
        var condition   = { _id: new ObjectID(local._id)};
        if(!local._id){
            vlocal.save(function(err, doc){
                if(err){
                    callback(err);
                }
                else {
                    callback(doc);
                }
            });
        }
        else {
            localmodel.model.update(condition,//{$set: 
vlocal
            //}
                                    ,{
            upsert:false
            },function updateCallback(err) {
						if(err){
							console.log('Atualização do local falhou, ID: ' + local._id);
                            console.log(err);
							callback(false);
						}
						else {
							console.log('Sucesso ao atualizar o ID: ' + local._id);
							callback(local);
						}
            });    
        }
    };

//    var update = function(local, callback){
//        localmodel.model.update({
//					_id: local.id
//        },{$set: 
//            local //Verificar se é adequado para update.
//                
//          },{
//             upsert:false
//            },function updateCallback(err) {
//						if(err){
//							console.log('Atualização do local falhou, ID: ' + evento.id);
//							callback(false);
//						}
//						else {
//							console.log(': ' + local.id);
//							callback(true);
//						}
//        });    
//    };
    
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
                   "salvar"   : salvar,
                   //"update"   : update,
                   "erase"    : erase};

	return retorno;	
	}
