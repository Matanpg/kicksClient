const Mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/kicks';

Mongoose.connect(url);

const db = Mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected to MongoDB');
});

module.exports = db;