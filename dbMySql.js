const Sequelize = require('sequelize');

module.exports = new Sequelize('kicks', 'root', '1234', {
  host: 'localhost',
  dialect: 'mysql'
});