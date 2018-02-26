const Mongoose = require('mongoose');
const db = require('../dbMongo');
const Schema = Mongoose.Schema;

let fieldSchema = new Schema({
    name: String
  });

let Fields = module.exports = Mongoose.model('Field', fieldSchema);

module.exports.getFields = function(callback, limit) {
    Fields.find(callback).limit(limit);
};



