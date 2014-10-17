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
            
            if(vlocal.razaosocial           === undefined){vlocal.razaosocial           = '';}
            if(vlocal.cnpj                  === undefined){vlocal.cnpj                  = '';}
            if(vlocal.inscricaoestadual     === undefined){vlocal.inscricaoestadual     = '';}
            if(vlocal.inscricaomunicipal    === undefined){vlocal.inscricaomunicipal    = '';}
            if(vlocal.cep                   === undefined){vlocal.cep                   = '';}
            if(vlocal.website               === undefined){vlocal.website               = '';}
            if(vlocal.fornecedoridid        === undefined){vlocal.fornecedoridid        = '';}
            if(vlocal.imagembanner          === undefined){vlocal.imagembanner          = '';}
            
            var vlocalsid = {   estabelecimento    : vlocal.estabelecimento,
                                loc                : vlocal.loc,
                                fornecedorid       : vlocal.fornecedoridid,
                                usuariocadastroid  : vlocal.usuariocadastroid,
					            imagembanner       : vlocal.imagembanner,
                                razaosocial        : vlocal.razaosocial,
                                cnpj               : vlocal.cnpj,
                                inscricaoestadual  : vlocal.inscricaoestadual,
                                inscricaomunicipal : vlocal.inscricaomunicipal,
                                logradouro         : vlocal.logradouro,
                                complemento        : vlocal.complemento,
                                bairro             : vlocal.bairro,
                                cidade             : vlocal.cidade,
                                estado             : vlocal.estado,
                                cep                : vlocal.cep,
                                email              : vlocal.email,
                                telefone           : vlocal.telefone,
                                website            : vlocal.website,
                                forauso            : vlocal.forauso,
                                situacao           : vlocal.situacao}; 
               
            console.log(vlocalsid);
            console.log('---------------');
            localmodel.model.findByIdAndUpdate(condition,{$set: vlocalsid},{
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
