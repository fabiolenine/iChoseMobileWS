var mongoose = require('mongoose');
var tagSchema;

tagSchema = new mongoose.Schema({etiqueta  : String,
                                 timestamp : {type: Date, default: Date.now},
                                 forauso   : {type: Boolean, default: false}});

exports.model = mongoose.model('tag',tagSchema);