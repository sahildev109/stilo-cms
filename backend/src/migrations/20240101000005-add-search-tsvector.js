'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS search_vec tsvector;
      CREATE INDEX IF NOT EXISTS idx_posts_search_vec ON posts USING GIN(search_vec);

      CREATE OR REPLACE FUNCTION update_post_search_vec()
      RETURNS trigger AS $$
      DECLARE latest_text TEXT;
      BEGIN
        SELECT pv.plain_text INTO latest_text
        FROM post_versions pv
        WHERE pv.post_id = NEW.post_id
        ORDER BY pv.version_num DESC LIMIT 1;

        UPDATE posts SET search_vec =
          setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
          setweight(to_tsvector('english', COALESCE(latest_text, '')), 'B')
        WHERE id = NEW.post_id;

        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER trg_post_version_search
      AFTER INSERT ON post_versions
      FOR EACH ROW EXECUTE FUNCTION update_post_search_vec();
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS trg_post_version_search ON post_versions;
      DROP FUNCTION IF EXISTS update_post_search_vec();
      DROP INDEX IF EXISTS idx_posts_search_vec;
      ALTER TABLE posts DROP COLUMN IF EXISTS search_vec;
    `);
  }
};
