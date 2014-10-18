var mongoose = require('mongoose');
var estadoscidadesSchema;

estadoscidadesSchema = new mongoose.Schema({sigla   : String,
                                            nome    : String,
                                            cidades : []);

exports.model = mongoose.model('estadoscidade',estadoscidadesSchema);