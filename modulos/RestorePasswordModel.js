var mongoose = require('mongoose');
var restorepasswordSchema;

restorepasswordSchema = new mongoose.Schema({
                                       		usuarioid: 	Object, 
                                        	email: 		String,
                                        	timestamp: 	{type: Date, default: Date.now},
											loc: 		{type: {type: 			String},
                                            					coordinates: 	[Number]},
											utilizou: 		Boolean 
					});

exports.model = mongoose.model('restorepassword',restorepasswordSchema);
