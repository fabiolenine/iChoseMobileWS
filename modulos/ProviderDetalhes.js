//ProviderDetalhes.js
module.exports = function(mongoose)
	{
	var providermodel      = require('./ProviderModel.js');
    var userprovidermodel  = require('./ProviderUserModel.js');  // local up the user model
    
    var ObjectID 	  = mongoose.Types.ObjectId;
            
	//chamar o model e acima fazer um require;

    var list = function(data, callback){
    
        providermodel.model.find(function(err, doc){
            if(err){
                console.log('Erro na busca dos locais');
            }
            else {
                callback(doc);
            }
        });
    };
    
    var providerlist = function(data, callback){
    
        providermodel.model.find({},{nomefantasia:1},function(err, doc){
            if(err){
                console.log('Erro na busca dos locais');
            }
            else {
                callback(doc);
            }
        });
    };
    
    var salvar = function(data, callback){ 
        var vdata       = new providermodel.model(data);
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
                        
            if(vdata.razaosocial           === undefined){vdata.razaosocial           = '';}
            if(vdata.cnpj                  === undefined){vdata.cnpj                  = '';}
            if(vdata.inscricaoestadual     === undefined){vdata.inscricaoestadual     = '';}
            if(vdata.inscricaomunicipal    === undefined){vdata.inscricaomunicipal    = '';}
            if(vdata.cep                   === undefined){vdata.cep                   = '';}
            if(vdata.website               === undefined){vdata.website               = '';}
            if(vdata.situacao              === undefined){vdata.situacao              = '';}
            
            var vdatasid = {    nomefantasia       : vdata.nomefantasia,
                                nomeresponsavel    : vdata.nomeresponsavel,
                                nomecontato        : vdata.nomecontato,
                                cargo              : vdata.cargo,
                                setor              : vdata.setor,
                                razaosocial        : vdata.razaosocial,
                                cnpj               : vdata.cnpj,
                                inscricaoestadual  : vdata.inscricaoestadual,
                                inscricaomunicipal : vdata.inscricaomunicipal,
                                logradouro         : vdata.logradouro,
                                complemento        : vdata.complemento,
                                bairro             : vdata.bairro,
                                cidade             : vdata.cidade,
                                estado             : vdata.estado,
                                cep                : vdata.cep,
                                email              : vdata.email,
                                telefone           : vdata.telefone,
                                website            : vdata.website,
                                forauso            : vdata.forauso,
                                situacao           : vdata.situacao
                           }; 
               
            providermodel.model.update(condition,{ $set: vdatasid},{upsert:false},function updateCallback(err) {
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
        providermodel.model.update({_id: data},{$set: {forauso: true}},{upsert:false},function updateCallback(err) {
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
    
    
//
// LOCAL SIGNUP - Provider
//

    var userlist = function(data, callback){
    
        userprovidermodel.model.find(function(err, doc){
            if(err){
                console.log('Erro na busca dos locais:' + err);
            }
            else {
                callback(doc);
            }
        });
    };
    
    var usersalvar = function(data, callback){
        var newUser     = new userprovidermodel.model(data);
        var condition   = {_id: new ObjectID(data._id)};
        if(!data._id){
            // if there is no user with that email
            // create the user
            
            console.log(data);
            console.log('-------------------');
            console.log(data.local[0].password);

            // set the user's local credentials
            newUser.local.password      = newUser.generateHash(data.local[0].password);

            // save the user
            newUser.save(function(err,doc){
                if (err) throw err;
                    callback(doc);
            });
        }
        else {
            
            var newUsersid = {local : { nome         : newUser.nome,
                                        cargo        : newUser.cargo,
                                        urlfoto      : newUser.urlfoto,
                                        forauso      : newUser.forauso,
                                        datavalidade : newUser.datavalidade,
                                        email        : newUser.email,
                                        password     : newUser.generateHash(password)
                                    }
                            }; 
               
            userprovidermodel.model.update(condition,{ $set: newUsersid},{upsert:false},function updateCallback(err) {
						if(err){
							console.log('Atualização do data falhou, ID: ' + condition);
                            console.log(err);
							callback(false);
						}
						else {
							console.log('Sucesso ao atualizar o ID: ' + condition);
							callback(data);
						}
            });    
        }
    };
    
    var usererase = function(data, callback){
        userprovidermodel.model.update({_id: data},{$set: {forauso: true}},{upsert:false},function updateCallback(err) {
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
    
    var retorno = {"list"	        : list,
                   "providerlist"   : providerlist,
                   "salvar"         : salvar,
                   "erase"          : erase,
                   "userlist"       : userlist,
                   "usersalvar"     : usersalvar,
                   "usererase"      : usererase};

	return retorno;	
	}
