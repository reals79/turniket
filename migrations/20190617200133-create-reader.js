'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('readers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.ENUM('RS232', 'Wiegand')
      },
      format: {
        type: Sequelize.ENUM('decimal', 'hex', 'decimal-1c')
      },
      name: {
        type: Sequelize.STRING
      },
      direction: {
        type: Sequelize.STRING(5)
      },
      port: {
        type: Sequelize.STRING
      },
      pin: {
        type: Sequelize.INTEGER
      },
      pin_led: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('readers');
  }
};
