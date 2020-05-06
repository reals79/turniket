'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'readers',
      'check_periods',
      { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'readers',
      'check_periods'
    );
  }
};
