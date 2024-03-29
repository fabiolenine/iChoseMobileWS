var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var managementuserSchema;

// define the schema for our user model
var managementuserSchema = mongoose.Schema({
                                            local       : { email       : String,
                                                            password    : String}
//                                            ,
//                                            nome        : String,
//                                            cargo       : String,
//                                            foto        : String
                                        });

// methods
// generating a hash
managementuserSchema.methods.generateHash = function(password)
{   
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
managementuserSchema.methods.validPassword = function(password)
{
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('managementuser', managementuserSchema);
