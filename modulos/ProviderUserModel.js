var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var provideruserSchema;

// define the schema for our user model
var provideruserSchema = mongoose.Schema({local : { nome         : String,
                                                    cargo        : String,
                                                    urlfoto      : String,
                                                    forauso      : {type: Boolean, default: false},
                                                    timestamp    : {type: Date, default: Date.now},
                                                    datavalidade : {type: Date},
                                                    email        : String,
                                                    password     : String,
                                                    evento       : [],
                                                    perfil       : [],
                                                    historico    : []
                                                  }
                                        });

// methods
// generating a hash
provideruserSchema.methods.generateHash = function(password)
{   
    console.log('Acessou o metodo generateHash.');
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
provideruserSchema.methods.validPassword = function(password)
{
    console.log('Acessou o metodo validPassword.');
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
//module.exports = mongoose.model('provideruser', provideruserSchema);
exports.model = mongoose.model('provideruser', provideruserSchema);