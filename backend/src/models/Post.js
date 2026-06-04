'use strict';

module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    authorId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'author_id'
    },
    title: {
      type: DataTypes.STRING(512),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(512),
      allowNull: false,
      unique: true
    },
    excerpt: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('draft', 'published'),
      allowNull: false,
      defaultValue: 'draft'
    },
    searchVec: {
      type: DataTypes.TSVECTOR,
      allowNull: true,
      field: 'search_vec'
    },
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' }
  }, {
    tableName: 'posts',
    timestamps: false
  });

  Post.associate = (models) => {
    Post.belongsTo(models.User, { foreignKey: 'author_id' });
    Post.hasMany(models.PostVersion, { foreignKey: 'post_id' });
  };

  return Post;
};
