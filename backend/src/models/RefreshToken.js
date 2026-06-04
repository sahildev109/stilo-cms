'use strict';

module.exports = (sequelize, DataTypes) => {
  const RefreshToken = sequelize.define('RefreshToken', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false, field: 'user_id' },
    token: { type: DataTypes.STRING(512), allowNull: false, unique: true },
    expiresAt: { type: DataTypes.DATE, field: 'expires_at' }
  }, {
    tableName: 'refresh_tokens',
    timestamps: false
  });

  RefreshToken.associate = (models) => {
    RefreshToken.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return RefreshToken;
};
