'use strict';
module.exports = (sequelize, DataTypes) => {
  const Card = sequelize.define('card', {
    number: DataTypes.STRING(20),
    periods: {
        type: DataTypes.TEXT,
        get: function() {
            return JSON.parse(this.getDataValue('periods'));
        },
        set: function(value) {
            this.setDataValue('periods', JSON.stringify(value));
        }
    },
    allow_exit: DataTypes.BOOLEAN,
    activated: DataTypes.BOOLEAN
  }, {});
  Card.associate = function(models) {
    // associations can be defined here
  };
  return Card;
};
