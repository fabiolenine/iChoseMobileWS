var mongoose = require('mongoose');
var emailverao2015Schema;

emailverao2015Schema = new mongoose.Schema({
                                       		email: 		String,
                                        	timestamp: 	{type: Date, default: Date.now},
											loc: 		{type: {type: 			String},
                                            					coordinates: 	[Number]},
											utilizado: 	Boolean,
                                            confirmado: Boolean,
                                            cancelado:  Boolean
					});

exports.model = mongoose.model('verao2015email',emailverao2015Schema);