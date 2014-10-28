var mongoose = require('mongoose');
var cargoSchema;

cargoSchema = new mongoose.Schema({ cargo     : String,
                                    timestamp : {type: Date, default: Date.now},
                                    forauso   : {type: Boolean, default: false}});

exports.model = mongoose.model('cargo',cargoSchema);