'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('post_versions', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()')
      },
      post_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'posts',
          key: 'id'
        }
      },
      author_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      version_num: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING(512),
        allowNull: false
      },
      content: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      plain_text: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()')
      }
    });

    await queryInterface.addConstraint('post_versions', {
      fields: ['post_id', 'version_num'],
      type: 'unique',
      name: 'post_versions_post_id_version_num_unique'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('post_versions', 'post_versions_post_id_version_num_unique');
    await queryInterface.dropTable('post_versions');
  }
};
