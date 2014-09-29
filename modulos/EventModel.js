var mongoose = require('mongoose');
var eventSchema;

eventSchema = new mongoose.Schema({estabelecimento    : String,
					               evento             : String,
					               dataevento         : Date,
                                   timestamp          : {type: Date, default: Date.now},
								   loc                : {type: {type: 	String,
                                                                enum:    ['Point']},
                                                         coordinates: 	[Number]},
					               fornecedorid       : Object,
                                   esteblecimentoid   : Object,
					               usuariocadastroid  : Object,
					               imagembanner       : String,
                                   abertura           : String, 
                                   inicio             : String,
                                   classificacao      : Number,
                                   descricao          : String,
                                   urlyoutube         : String,
                                   urlscrapedetalhes  : String
				});

exports.model = mongoose.model('event',eventSchema);
