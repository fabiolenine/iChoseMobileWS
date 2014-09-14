var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var providerSchema;

// define the schema for our user model
var providerSchema = mongoose.Schema({  razaosocial         : ''
                                        ,nomefantasia       : ''
                                        ,nomeresponsavel    : ''
                                        ,cnpj               : ''
                                        ,inscricaoestadual  : ''
                                        ,inscricaomunicipal : ''
                                        ,logradouro         : ''
                                        ,complemento        : ''
                                        ,bairro             : ''
                                        ,cidade             : ''
                                        ,estado             : ''
                                        ,cep                : ''
                                        ,caixapostal        : ''
                                        ,nomecontato        : ''
                                        ,cargo              : ''
                                        ,setor              : ''
                                        ,email              : ''
                                        ,telefone           : ''
                                        ,website            : ''
                                        ,situacao           : 'Habilitado'
                                        ,forauso            : false
                                        ,id                 : 0   
                                        });

// create the model for users and expose it to our app
module.exports = mongoose.model('provider', providerSchema);