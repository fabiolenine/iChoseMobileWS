module.exports = function(mongoose)
	{
	var eventmodel  = require('./EventModel.js');
    var ObjectID 	= mongoose.Types.ObjectId;
            
	//chamar o model e acima fazer um require;

    var list = function(data, callback){
    
        eventmodel.model.find(function(err, doc){
            if(err){
                console.log('Erro na busca dos locais');
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
            
            var vdatasid = {evento             : String,
					        dataevento         : String,
                            estabelecimentoid  : Object,
					        usuariocadastroid  : Object,
					        imagembanner       : String,
                            abertura           : String, 
                            inicio             : String,
                            classificacao      : String,
                            descricao          : String,
                            urlyoutube         : String,
                            website            : String,
                            tags               : [],
                                   forauso            : {type: Boolean, default: false},
                                   situacao           : String,
                                   ingresso           : [{  genero  : String
                                                         //   ,produto : [{setor : String,
                                                        //                 valor : String}]
                                                         }]}; 
               
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
    
    var retorno = {"list"	  : list,
                   "salvar"   : salvar,
                   "erase"    : erase};

	return retorno;	
	}