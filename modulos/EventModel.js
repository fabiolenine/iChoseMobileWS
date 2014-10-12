var mongoose = require('mongoose');
var eventSchema;

eventSchema = new mongoose.Schema({evento             : String,
					               dataevento         : String,
                                   timestamp          : {type: Date, default: Date.now},
					               fornecedorid       : Object,
                                   estabelecimentoid  : Object,
					               usuariocadastroid  : Object,
					               imagembanner       : String,
                                   abertura           : String, 
                                   inicio             : String,
                                   classificacao      : String,
                                   descricao          : String,
                                   urlyoutube         : String,
                                   urlscrapedetalhes  : String,
                                   website            : String,
                                   tags               : [],
                                   forauso            : {type: Boolean, default: false},
                                   situacao           : String,
                                   ingresso           : [{  genero  : String
                                                            ,produto : [{setor : String,
                                                                         valor : String}]
                                                         }]});

exports.model = mongoose.model('event',eventSchema);