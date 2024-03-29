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
    
    var locallist = function(data, callback){
    
        localmodel.model.find({},{estabelecimento:1, cidade:1, estado:1},function(err, doc){
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
            
            var latitude    = vlocal.loc.coordinates[1];
            var longitude   = vlocal.loc.coordinates[0];
            
            if(vlocal.razaosocial           === undefined){vlocal.razaosocial           = '';}
            if(vlocal.cnpj                  === undefined){vlocal.cnpj                  = '';}
            if(vlocal.inscricaoestadual     === undefined){vlocal.inscricaoestadual     = '';}
            if(vlocal.inscricaomunicipal    === undefined){vlocal.inscricaomunicipal    = '';}
            if(vlocal.cep                   === undefined){vlocal.cep                   = '';}
            if(vlocal.website               === undefined){vlocal.website               = '';}
            if(vlocal.fornecedoridid        === undefined){vlocal.fornecedoridid        = '';}
            if(vlocal.imagembanner          === undefined){vlocal.imagembanner          = '';}
            if(vlocal.loc.coordinates.length == 0 )       {var latitude                 = -35.717680;
                                                           var longitude                = -9.644430;}
            
            var vlocalsid = {   estabelecimento    : vlocal.estabelecimento,
                                loc                : { "type" : "Point", "coordinates" : [  longitude,  latitude ] },
                                fornecedorid       : vlocal.fornecedorid,
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
               
            localmodel.model.update(condition,{ $set: vlocalsid},{upsert:false},function updateCallback(err) {
						if(err){
							//console.log('Atualização do local falhou, ID: ' + vlocal._id);
                            //console.log(err);
							callback(false);
						}
						else {
							//console.log('Sucesso ao atualizar o ID: ' + vlocal._id);
							callback(local);
						}
            });    
        }
    };
    
    var erase = function(local, callback){
        localmodel.model.update({_id: local},{$set: {forauso: true}},{upsert:false},function updateCallback(err) {
						if(err){
							console.log('exclusão do ID: ' + local);
							callback(false);
						}
						else {
							console.log('Sucesso ao excluir o ID: ' + local);
							callback(true);
						}
        });    
    };
    
    var retorno = {"list"	    : list,
                   "locallist"  : locallist,
                   "salvar"     : salvar,
                   "erase"      : erase};

	return retorno;	
	}
