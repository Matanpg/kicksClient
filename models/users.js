const Mongoose = require('mongoose');
const db = require('../dbMongo');
const Schema = Mongoose.Schema;

let userSchema = new Schema({
    first_name: String,
    last_name: String,
    user_name: String,
    email: String,
    password: String,
    type: String
  });

  userSchema.statics.getUsers = function(params) {
    return this.find(params);
  };

  userSchema.statics.createUser = function(params) {
    return this.create(params);
  };
 

module.exports = Mongoose.model('User', userSchema);



