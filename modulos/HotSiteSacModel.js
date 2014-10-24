var mongoose = require('mongoose');
var hotsitesacSchema, OcorrenciasSchema

OcorrenciasSchema = new mongoose.Schema({timestamp   : {type: Date, default: Date.now},
								         loc         : {type: {type: String,
                                                              enum: ['Point']},
                                                              coordinates: [Number]},
					                     nome        : String,
                                         mensagem    : String,
                                         forauso     : {type: Boolean, default: false},
                                         situacao    : {type: String , default: 'Não lido'},
                                         confirmado  : {type: Boolean, default: false}
                                       });

hotsitesacSchema = new mongoose.Schema({email       : String,
                                        ocorrencias : [Ocorrencias]});

exports.model = mongoose.model('hotsitesac',hotsitesacSchema);