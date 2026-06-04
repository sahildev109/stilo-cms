'use strict';

const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at'
    }
  }, {
    tableName: 'users',
    timestamps: false,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password && !user.password.startsWith('$2a$') && !user.password.startsWith('$2b$')) {
          const hash = await bcrypt.hash(user.password, 12);
          user.password = hash;
        }
      }
    }
  });

  User.associate = (models) => {
    User.hasMany(models.Post, { foreignKey: 'author_id' });
    User.hasMany(models.PostVersion, { foreignKey: 'author_id' });
    User.hasMany(models.RefreshToken, { foreignKey: 'user_id' });
  };

  return User;
};
