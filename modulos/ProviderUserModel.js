var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var provideruserSchema;

// define the schema for our user model
var provideruserSchema = mongoose.Schema({
                                            local       : { email       : String,
                                                            password    : String}
//                                            ,
//                                            nome        : String,
//                                            cargo       : String,
//                                            foto        : String,
//                                            providerid  : Object
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
module.exports = mongoose.model('provideruser', provideruserSchema);
