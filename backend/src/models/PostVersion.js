'use strict';

module.exports = (sequelize, DataTypes) => {
  const PostVersion = sequelize.define('PostVersion', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    postId: { type: DataTypes.UUID, allowNull: false, field: 'post_id' },
    authorId: { type: DataTypes.UUID, allowNull: false, field: 'author_id' },
    versionNum: { type: DataTypes.INTEGER, allowNull: false, field: 'version_num' },
    title: { type: DataTypes.STRING(512), allowNull: false },
    content: { type: DataTypes.JSONB, allowNull: false },
    plainText: { type: DataTypes.TEXT, allowNull: false, field: 'plain_text' },
    createdAt: { type: DataTypes.DATE, field: 'created_at' }
  }, {
    tableName: 'post_versions',
    timestamps: false,
    indexes: [
      { unique: true, fields: ['post_id', 'version_num'] },
      { fields: ['post_id'] }
    ]
  });

  PostVersion.associate = (models) => {
    PostVersion.belongsTo(models.Post, { foreignKey: 'post_id' });
    PostVersion.belongsTo(models.User, { foreignKey: 'author_id' });
  };

  return PostVersion;
};
