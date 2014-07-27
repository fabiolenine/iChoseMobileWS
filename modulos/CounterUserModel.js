var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var counteruserSchema;

// define the schema for our user model
var counteruserSchema = mongoose.Schema({
                                            local       : { email       : String,
                                                            password    : String}
//                                            ,
//                                            nome        : String,
//                                            cargo       : String,
//                                            foto        : String
                                        });

// methods
// generating a hash
counteruserSchema.methods.generateHash = function(password)
{   
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
counteruserSchema.methods.validPassword = function(password)
{
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('counteruser', counteruserSchema);
