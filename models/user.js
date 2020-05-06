'use strict';
const bcrypt = require('bcrypt');

const beforeValidate = (instance) => {
    instance.password = bcrypt.hashSync(instance.password, bcrypt.genSaltSync(8));
}

module.exports = (sequelize, DataTypes) => {

  const User = sequelize.define('user', {
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    hooks: {
        beforeCreate: beforeValidate,
        beforeUpdate: beforeValidate,
    }
  });
  User.associate = function(models) {
    // associations can be defined here
  };

  return User;
};
