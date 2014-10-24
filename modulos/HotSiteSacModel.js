var mongoose = require('mongoose');
var hotsitesacSchema;

hotsitesacSchema = new mongoose.Schema({email       : String,
                                        ocorrencias : [{  timestamp   : {type: Date, default: Date.now},
                                                         loc         : {type: {type: String,
                                                                              enum: ['Point']},
                                                                              coordinates: [Number]},
                                                         nome        : String,
                                                         mensagem    : String,
                                                         forauso     : {type: Boolean, default: false},
                                                         situacao    : {type: String , default: 'Não lido'},
                                                         confirmado  : {type: Boolean, default: false}}]
                                       });

exports.model = mongoose.model('hotsitesac',hotsitesacSchema);