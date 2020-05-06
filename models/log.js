'use strict';
module.exports = (sequelize, DataTypes) => {
  const Log = sequelize.define('log', {
    card_id: {
        type: DataTypes.INTEGER,
        reference: {
            model: 'card',
            key: 'id'
        }
    },
    reader_id: {
        type: DataTypes.INTEGER,
        reference: {
            model: 'reader',
            key: 'id'
        }
    },
    synced: DataTypes.BOOLEAN
  }, {});
  Log.associate = function(models) {
    // associations can be defined here
    Log.belongsTo(models.card, { foreignKey: 'card_id' });
    Log.belongsTo(models.reader, { foreignKey: 'reader_id' });
  };
  return Log;
};
