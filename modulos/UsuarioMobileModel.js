var mongoose = require('mongoose');
var usuariomobileSchema;

usuariomobileSchema = new mongoose.Schema({ nomecompleto: { nomeprincipal:  String,
                                                            sobrenome:      String},
                                            genero:         String,
                                            cpf:            String,
                                            datanascimento: String,
                                            celular:        String,
                                            cep:            String,
                                            email:          String,
                                            senha:          String,
					                        foto:		    String});

exports.model = mongoose.model('usuariomobile',usuariomobileSchema);
