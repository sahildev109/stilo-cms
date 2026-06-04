'use strict';

const bcrypt = require('bcrypt');

const users = {
  alice: '11111111-1111-4111-8111-111111111111',
  bob: '22222222-2222-4222-8222-222222222222'
};

const posts = {
  node: '33333333-3333-4333-8333-333333333333',
  pg: '44444444-4444-4444-8444-444444444444',
  react: '55555555-5555-4555-8555-555555555555',
  ts: '66666666-6666-4666-8666-666666666666',
  docker: '77777777-7777-4777-8777-777777777777'
};

const versionIds = {
  node: ['aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa4'],
  pg: ['bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2'],
  react: ['cccccccc-cccc-4ccc-8ccc-ccccccccccc1', 'cccccccc-cccc-4ccc-8ccc-ccccccccccc2'],
  ts: ['dddddddd-dddd-4ddd-8ddd-ddddddddddd1', 'dddddddd-dddd-4ddd-8ddd-ddddddddddd2'],
  docker: ['eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee1', 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee2']
};

function block(id, type, text) {
  return {
    id,
    type,
    content: text.map(value => ({ type: 'text', text: value }))
  };
}

function nodeVersionContent(version) {
  const contents = {
    1: [
      block('f1111111-1111-4111-8111-111111111111', 'heading', ['Getting Started with Node.js']),
      block('f1111111-1111-4111-8111-111111111112', 'paragraph', ['Node.js runs JavaScript on the server and is a practical first step for backend development.']),
      block('f1111111-1111-4111-8111-111111111113', 'paragraph', ['Install Node.js, create a project folder, and run npm init to begin.'])
    ],
    2: [
      block('f1111111-1111-4111-8111-111111111111', 'heading', ['Getting Started with Node.js']),
      block('f1111111-1111-4111-8111-111111111112', 'paragraph', ['Node.js runs JavaScript on the server and is a practical first step for backend development.']),
      block('f1111111-1111-4111-8111-111111111114', 'bulletListItem', ['Use npm install to add dependencies and lock versions.'])
    ],
    3: [
      block('f1111111-1111-4111-8111-111111111111', 'heading', ['Getting Started with Node.js']),
      block('f1111111-1111-4111-8111-111111111115', 'paragraph', ['Node.js gives you the event loop, npm, and a huge ecosystem for building APIs.']),
      block('f1111111-1111-4111-8111-111111111114', 'bulletListItem', ['Use npm install to add dependencies and lock versions.']),
      block('f1111111-1111-4111-8111-111111111116', 'paragraph', ['Keep the first version small, then add routes and persistence incrementally.'])
    ],
    4: [
      block('f1111111-1111-4111-8111-111111111111', 'heading', ['Getting Started with Node.js']),
      block('f1111111-1111-4111-8111-111111111117', 'paragraph', ['Node.js gives you the event loop, npm, and a huge ecosystem for building APIs.']),
      block('f1111111-1111-4111-8111-111111111114', 'bulletListItem', ['Use npm install to add dependencies and lock versions.']),
      block('f1111111-1111-4111-8111-111111111118', 'paragraph', ['A small HTTP server is enough to understand the request and response lifecycle.'])
    ]
  };

  return contents[version];
}

module.exports = {
  async up(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      const passwordHash = await bcrypt.hash('Password123!', 12);
      const now = new Date('2024-01-01T00:00:00.000Z');

      await queryInterface.bulkInsert('users', [
        {
          id: users.alice,
          email: 'alice@example.com',
          password: passwordHash,
          name: 'Alice Chen',
          created_at: now
        },
        {
          id: users.bob,
          email: 'bob@example.com',
          password: passwordHash,
          name: 'Bob Tanaka',
          created_at: now
        }
      ], { transaction });

      await queryInterface.bulkInsert('posts', [
        {
          id: posts.node,
          author_id: users.alice,
          title: 'Getting Started with Node.js',
          slug: 'getting-started-with-node-js',
          excerpt: 'A practical introduction to Node.js basics.',
          status: 'published',
          search_vec: null,
          created_at: now,
          updated_at: now
        },
        {
          id: posts.pg,
          author_id: users.alice,
          title: 'Understanding PostgreSQL Indexes',
          slug: 'understanding-postgresql-indexes',
          excerpt: 'Why indexes matter for query performance.',
          status: 'published',
          search_vec: null,
          created_at: now,
          updated_at: now
        },
        {
          id: posts.react,
          author_id: users.alice,
          title: 'Draft: React Performance Tips',
          slug: 'draft-react-performance-tips',
          excerpt: 'Working notes on improving React rendering behavior.',
          status: 'draft',
          search_vec: null,
          created_at: now,
          updated_at: now
        },
        {
          id: posts.ts,
          author_id: users.bob,
          title: 'Introduction to TypeScript',
          slug: 'introduction-to-typescript',
          excerpt: 'A guided walkthrough of TypeScript fundamentals.',
          status: 'published',
          search_vec: null,
          created_at: now,
          updated_at: now
        },
        {
          id: posts.docker,
          author_id: users.bob,
          title: 'Draft: Docker for Beginners',
          slug: 'draft-docker-for-beginners',
          excerpt: 'Container basics for a future publish.',
          status: 'draft',
          search_vec: null,
          created_at: now,
          updated_at: now
        }
      ], { transaction });

      await queryInterface.bulkInsert('post_versions', [
        {
          id: versionIds.node[0],
          post_id: posts.node,
          author_id: users.alice,
          version_num: 1,
          title: 'Getting Started with Node.js',
          content: JSON.stringify(nodeVersionContent(1)),
          plain_text: 'Getting Started with Node.js Node.js runs JavaScript on the server and is a practical first step for backend development. Install Node.js, create a project folder, and run npm init to begin.',
          created_at: new Date('2024-01-02T10:00:00.000Z')
        },
        {
          id: versionIds.node[1],
          post_id: posts.node,
          author_id: users.alice,
          version_num: 2,
          title: 'Getting Started with Node.js',
          content: JSON.stringify(nodeVersionContent(2)),
          plain_text: 'Getting Started with Node.js Node.js runs JavaScript on the server and is a practical first step for backend development. Use npm install to add dependencies and lock versions.',
          created_at: new Date('2024-01-03T10:00:00.000Z')
        },
        {
          id: versionIds.node[2],
          post_id: posts.node,
          author_id: users.alice,
          version_num: 3,
          title: 'Getting Started with Node.js',
          content: JSON.stringify(nodeVersionContent(3)),
          plain_text: 'Getting Started with Node.js Node.js gives you the event loop, npm, and a huge ecosystem for building APIs. Use npm install to add dependencies and lock versions. Keep the first version small, then add routes and persistence incrementally.',
          created_at: new Date('2024-01-04T10:00:00.000Z')
        },
        {
          id: versionIds.node[3],
          post_id: posts.node,
          author_id: users.alice,
          version_num: 4,
          title: 'Getting Started with Node.js',
          content: JSON.stringify(nodeVersionContent(4)),
          plain_text: 'Getting Started with Node.js Node.js gives you the event loop, npm, and a huge ecosystem for building APIs. Use npm install to add dependencies and lock versions. A small HTTP server is enough to understand the request and response lifecycle.',
          created_at: new Date('2024-01-05T10:00:00.000Z')
        },
        {
          id: versionIds.pg[0],
          post_id: posts.pg,
          author_id: users.alice,
          version_num: 1,
          title: 'Understanding PostgreSQL Indexes',
          content: JSON.stringify([
            block('g1111111-1111-4111-8111-111111111111', 'heading', ['Understanding PostgreSQL Indexes']),
            block('g1111111-1111-4111-8111-111111111112', 'paragraph', ['Indexes help PostgreSQL locate rows faster when filtering and joining tables.'])
          ]),
          plain_text: 'Understanding PostgreSQL Indexes Indexes help PostgreSQL locate rows faster when filtering and joining tables.',
          created_at: new Date('2024-01-02T11:00:00.000Z')
        },
        {
          id: versionIds.pg[1],
          post_id: posts.pg,
          author_id: users.alice,
          version_num: 2,
          title: 'Understanding PostgreSQL Indexes',
          content: JSON.stringify([
            block('g1111111-1111-4111-8111-111111111111', 'heading', ['Understanding PostgreSQL Indexes']),
            block('g1111111-1111-4111-8111-111111111113', 'paragraph', ['A B-tree index is the default choice for equality and range lookups.']),
            block('g1111111-1111-4111-8111-111111111114', 'bulletListItem', ['Check query plans before adding extra indexes.'])
          ]),
          plain_text: 'Understanding PostgreSQL Indexes A B-tree index is the default choice for equality and range lookups. Check query plans before adding extra indexes.',
          created_at: new Date('2024-01-03T11:00:00.000Z')
        },
        {
          id: versionIds.react[0],
          post_id: posts.react,
          author_id: users.alice,
          version_num: 1,
          title: 'Draft: React Performance Tips',
          content: JSON.stringify([
            block('h1111111-1111-4111-8111-111111111111', 'heading', ['React Performance Tips']),
            block('h1111111-1111-4111-8111-111111111112', 'paragraph', ['Use memoization carefully and measure before optimizing.'])
          ]),
          plain_text: 'React Performance Tips Use memoization carefully and measure before optimizing.',
          created_at: new Date('2024-01-04T12:00:00.000Z')
        },
        {
          id: versionIds.react[1],
          post_id: posts.react,
          author_id: users.alice,
          version_num: 2,
          title: 'Draft: React Performance Tips',
          content: JSON.stringify([
            block('h1111111-1111-4111-8111-111111111111', 'heading', ['React Performance Tips']),
            block('h1111111-1111-4111-8111-111111111113', 'paragraph', ['Split large components into smaller parts to reduce unnecessary renders.'])
          ]),
          plain_text: 'React Performance Tips Split large components into smaller parts to reduce unnecessary renders.',
          created_at: new Date('2024-01-05T12:00:00.000Z')
        },
        {
          id: versionIds.ts[0],
          post_id: posts.ts,
          author_id: users.bob,
          version_num: 1,
          title: 'Introduction to TypeScript',
          content: JSON.stringify([
            block('i1111111-1111-4111-8111-111111111111', 'heading', ['Introduction to TypeScript']),
            block('i1111111-1111-4111-8111-111111111112', 'paragraph', ['TypeScript adds static typing on top of JavaScript.'])
          ]),
          plain_text: 'Introduction to TypeScript TypeScript adds static typing on top of JavaScript.',
          created_at: new Date('2024-01-04T13:00:00.000Z')
        },
        {
          id: versionIds.ts[1],
          post_id: posts.ts,
          author_id: users.bob,
          version_num: 2,
          title: 'Introduction to TypeScript',
          content: JSON.stringify([
            block('i1111111-1111-4111-8111-111111111111', 'heading', ['Introduction to TypeScript']),
            block('i1111111-1111-4111-8111-111111111113', 'paragraph', ['Interfaces, unions, and generics help model complex application data.'])
          ]),
          plain_text: 'Introduction to TypeScript Interfaces, unions, and generics help model complex application data.',
          created_at: new Date('2024-01-05T13:00:00.000Z')
        },
        {
          id: versionIds.docker[0],
          post_id: posts.docker,
          author_id: users.bob,
          version_num: 1,
          title: 'Draft: Docker for Beginners',
          content: JSON.stringify([
            block('j1111111-1111-4111-8111-111111111111', 'heading', ['Docker for Beginners']),
            block('j1111111-1111-4111-8111-111111111112', 'paragraph', ['Docker packages applications with their runtime and dependencies.'])
          ]),
          plain_text: 'Docker for Beginners Docker packages applications with their runtime and dependencies.',
          created_at: new Date('2024-01-04T14:00:00.000Z')
        },
        {
          id: versionIds.docker[1],
          post_id: posts.docker,
          author_id: users.bob,
          version_num: 2,
          title: 'Draft: Docker for Beginners',
          content: JSON.stringify([
            block('j1111111-1111-4111-8111-111111111111', 'heading', ['Docker for Beginners']),
            block('j1111111-1111-4111-8111-111111111113', 'paragraph', ['A Dockerfile defines the image build steps in a repeatable way.'])
          ]),
          plain_text: 'Docker for Beginners A Dockerfile defines the image build steps in a repeatable way.',
          created_at: new Date('2024-01-05T14:00:00.000Z')
        }
      ], { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('post_versions', null, {});
    await queryInterface.bulkDelete('posts', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};
