var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var managementuserSchema;

// define the schema for our user model
var managementuserSchema = mongoose.Schema({
                                            local       : { email   : String,
                                                            senha   : String}
//                                            ,
//                                            nome        : String,
//                                            cargo       : String,
//                                            foto        : String
                                        });

// methods
// generating a hash
managementuserSchema.methods.generateHash = function(senha)
{   
    return bcrypt.hashSync(senha, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
managementuserSchema.methods.validPassword = function(senha)
{
    return bcrypt.compareSync(senha, this.local.senha);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('managementuser', managementuserSchema);
