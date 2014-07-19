var mongoose = require('mongoose');
var triedrestorepasswordSchema;

triedrestorepasswordSchema = new mongoose.Schema({
                                        	       	email: 		String,
                                        	      	timestamp: 	{type: Date, default: Date.now},
						 	                        loc: 		{type: {type: String},
									                coordinates: [Number]}
                                                });

exports.model = mongoose.model('triedrestorepassword',triedrestorepasswordSchema);
