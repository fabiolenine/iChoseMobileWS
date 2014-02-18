var mongoose = require('mongoose');
var eventSchema;

eventSchema = new mongoose.Schema({
					casa: 			String,
					evento: 		String,
					dataevento: 		Date,
                                       	timestamp: 		{type: Date, default: Date.now},
					loc: 			{type: {type: String},
                                               	        	coordinates: 	[Number]},
					fornecedorid: 		Object,
					usuariocadastroid: 	Object,
					imagembanner: 		Buffer  
				});

exports.model = mongoose.model('event',eventSchema);
