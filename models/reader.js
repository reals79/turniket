'use strict';
module.exports = (sequelize, DataTypes) => {
  const Reader = sequelize.define('reader', {
    name: DataTypes.STRING,
    type: DataTypes.ENUM('RS232', 'Wiegand'),
    format: DataTypes.ENUM('decimal', 'hex', 'decimal-1c'),
    direction: DataTypes.STRING(5),
    port: DataTypes.STRING,
    pin: DataTypes.INTEGER,
    pin_led: DataTypes.INTEGER,
    check_periods: DataTypes.BOOLEAN
  }, {});
  Reader.associate = function(models) {
    // associations can be defined here
  };
  return Reader;
};
