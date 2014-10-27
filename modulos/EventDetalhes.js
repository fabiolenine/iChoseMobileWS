module.exports = function(mongoose)
	{
	var eventmodel  = require('./EventModel.js');
    var ObjectID 	= mongoose.Types.ObjectId;
            
	//chamar o model e acima fazer um require;

    var eventcount = function(data, callback){
        console.log('Acessei a função.');
        eventmodel.model.find({dataevento: {$gte: Date()}}).count().exec( function(err, doc){
            if(err){
                console.log('Erro na busca dos eventos: ' + err);
            }
            else {
                console.log('Valor do DOC: ' + doc);
                callback(doc);
            }
        });
    };
    
    var list = function(data, callback){
        eventmodel.model.find(function(err, doc){
            if(err){
                console.log('Erro na busca dos eventos');
            }
            else {
                callback(doc);
            }
        });
    };
    
    var salvar = function(data, callback){ 
        var vdata       = new eventmodel.model(data);
        var condition   = {_id: new ObjectID(data._id)};
        if(!data._id){
            vdata.save(function(err, doc){
                if(err){
                    callback(err);
                }
                else {
                    callback(doc);
                }
            });
        }
        else {
                        
            if(vdata.website               === undefined){vdata.website               = '';}
            if(vdata.situacao              === undefined){vdata.situacao              = '';}
            
            var vdatasid = {evento             : vdata.evento,
					        dataevento         : vdata.dataevento,
                            estabelecimentoid  : vdata.estabelecimentoid,
					        usuariocadastroid  : vdata.usuariocadastroid,
					        imagembanner       : vdata.imagembanner,
                            abertura           : vdata.abertura, 
                            inicio             : vdata.inicio,
                            classificacao      : vdata.classificacao,
                            descricao          : vdata.descricao,
                            urlyoutube         : vdata.urlyoutube,
                            website            : vdata.website,
                            tags               : vdata.tags,
                            forauso            : vdata.forauso,
                            situacao           : vdata.situacao,
                            ingresso           : vdata.ingresso}; 
               
            eventmodel.model.update(condition,{ $set: vdatasid},{upsert:false},function updateCallback(err) {
						if(err){
							console.log('Atualização do data falhou, ID: ' + vdata._id);
                            console.log(err);
							callback(false);
						}
						else {
							console.log('Sucesso ao atualizar o ID: ' + vdata._id);
							callback(data);
						}
            });    
        }
    };
    
    var erase = function(data, callback){
        eventmodel.model.update({_id: data},{$set: {forauso: true}},{upsert:false},function updateCallback(err) {
						if(err){
							console.log('exclusão do ID: ' + data);
							callback(false);
						}
						else {
							console.log('Sucesso ao excluir o ID: ' + data);
							callback(true);
						}
        });    
    };
    
    var retorno = {"list"	    : list,
                   "salvar"     : salvar,
                   "erase"      : erase,
                   "eventcount" : eventcount};

	return retorno;	
	}