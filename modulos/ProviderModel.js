var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var providerSchema;

// define the schema for our user model
var providerSchema = mongoose.Schema({  razaosocial        : String,
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

// create the model for users and expose it to our app
module.exports = mongoose.model('provider', providerSchema);