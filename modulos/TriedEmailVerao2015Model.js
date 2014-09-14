var mongoose = require('mongoose');
var triedemailverao2015Schema;

triedemailverao2015Schema = new mongoose.Schema({   email: 		String,
                                        	      	timestamp: 	{type: Date, default: Date.now},
						 	                        loc: 		{type: {type: String},
									                                   coordinates: [Number]}
                                                });
//Depois adicionar o registro de IP.

exports.model = mongoose.model('triedemailverao2015',triedemailverao2015Schema);