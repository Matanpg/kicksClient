const Sequelize = require('sequelize');
const db = require('../dbMySql');


module.exports = db.define('projects', {
  name: Sequelize.STRING,
  field: Sequelize.STRING,
  description: Sequelize.STRING,
  fundingTarget: Sequelize.INTEGER,
  totalFunds: Sequelize.INTEGER,
  fundingRate: Sequelize.DECIMAL,
  status: Sequelize.STRING,
  user_id: Sequelize.STRING,
  picture_big: Sequelize.STRING
}, {
  timestamps: false
  }
);

Sequelize.Model.SP_update_status = function (projid) {
  db.query('CALL updateFundRate(:param)',
    {replacements: {param: projid}}
  )
}

