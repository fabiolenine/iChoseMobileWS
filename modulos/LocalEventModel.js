var mongoose = require('mongoose');
var localeventSchema;

localeventSchema = new mongoose.Schema({estabelecimento    : String,
                                        timestamp          : {type: Date, default: Date.now},
								        loc                : {type: {type: 	String,
                                                                     enum:    ['Point']},
                                                              coordinates: 	[Number]},
					                    fornecedorid       : Object,
                                        usuariocadastroid  : Object,
					                    imagembanner       : String,
                                        razaosocial        : String,
                                        cnpj               : String,
                                        inscricaoestadual  : String,
                                        inscricaomunicipal : String,
                                        logradouro         : String,
                                        complemento        : String,
                                        bairro             : String,
                                        cidade             : String,
                                        estado             : String,
                                        cep                : String,
                                        email              : String,
                                        telefone           : String,
                                        website            : String,
                                        forauso            : {type: Boolean, default: false},
                                        situacao           : String});

exports.model = mongoose.model('localevent',localeventSchema);