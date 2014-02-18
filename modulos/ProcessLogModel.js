var mongoose = require('mongoose');
var processlogSchema;

processlogSchema = new mongoose.Schema({
										datahoraorigem: Date,
                                       	timestamp: 		{type: Date, default: Date.now},
										loc: 			{type: {type: 			String},
                                                      			coordinates: 	[Number]},
										usuarioid: 		Object,
										processo: 		{type: String, enum: ['Login','Cadastro','Termo','Lista de Baladas']}  
										});

exports.model = mongoose.model('processlog',processlogSchema);
