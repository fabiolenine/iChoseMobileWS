var mongoose = require('mongoose');
var providerSchema;

// define the schema for our user model
providerSchema = new mongoose.Schema({  razaosocial        : String,
                                        timestamp          : {type: Date, default: Date.now},
								        loc                : {type: {   type: 	String,
                                                                        enum:   ['Point']},
                                                              coordinates: 	[Number]},
                                        nomefantasia       : String,
                                        nomeresponsavel    : String,
                                        cnpj               : String,
                                        inscricaoestadual  : String,
                                        inscricaomunicipal : String,
                                        logradouro         : String,
                                        complemento        : String,
                                        bairro             : String,
                                        cidade             : String,
                                        estado             : String,
                                        cep                : String,
                                        nomecontato        : String,
                                        cargo              : String,
                                        setor              : String,
                                        email              : String,
                                        telefone           : String,
                                        website            : String,
                                        situacao           : String,
                                        forauso            : {type: Boolean, default: false} 
                                        });

exports.model = mongoose.model('provider', providerSchema);