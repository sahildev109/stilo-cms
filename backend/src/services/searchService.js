'use strict';

const db = require('../models');

async function searchPosts(q, page = 1, limit = 10) {
  const offset = (Number(page) - 1) * Number(limit);

  const [results] = await db.sequelize.query(`
    SELECT
      p.id,
      p.slug,
      p.excerpt,
      p.created_at AS "createdAt",
      pv.title,
      pv.version_num AS "versionNum",
      ts_rank(p.search_vec, query) AS rank,
      ts_headline(
        'english',
        pv.plain_text,
        query,
        'MaxWords=35, MinWords=15, StartSel=<mark>, StopSel=</mark>'
      ) AS headline
    FROM posts p
    JOIN LATERAL (
      SELECT title, plain_text, version_num
      FROM post_versions
      WHERE post_id = p.id
      ORDER BY version_num DESC
      LIMIT 1
    ) pv ON true,
    plainto_tsquery('english', :query) AS query
    WHERE p.status = 'published'
      AND p.search_vec @@ query
    ORDER BY rank DESC
    LIMIT :limit OFFSET :offset
  `, {
    replacements: {
      query: q,
      limit: Number(limit),
      offset
    }
  });

  return {
    results,
    total: results.length
  };
}

module.exports = {
  searchPosts
};
