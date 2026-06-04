# Architectural Decisions

## 1. Rich text editor: BlockNote

I chose BlockNote because it treats a list of block objects as its native data model, not HTML. Each block carries a stable UUID, which makes structural diffing trivially correct - I can identify added and removed blocks by ID without heuristic matching. The TypeScript schema means block content types are statically known, so `extractPlainText` and the diff algorithm are fully type-safe. Quill's Delta format and Slate's variable schema would both require significant adapter code to achieve the same properties.

## 2. Why JSON over HTML

HTML is a rendering artifact, not a content model. Storing HTML creates ambiguity: the same semantic content has many valid HTML representations (different attribute orders, equivalent tags), making diffing noisy. JSON blocks have a canonical structure - equality is deterministic. JSON is also portable across editors and renderer implementations, while HTML locks you into specific CSS. If we ever switch rendering engines, JSON content migrates cleanly.

## 3. Full snapshots vs. deltas

I store full snapshots. The tradeoff: snapshots use more storage but provide O(1) access to any version with zero reconstruction cost. Deltas save storage (typically 90% smaller per intermediate version) but require sequential reconstruction and are harder to implement correctly with arbitrary JSON. For a CMS at this scale - where posts are typically under 50 KB and version counts rarely exceed 100 - the storage cost is negligible. The operational simplicity of snapshots (restore is just a copy, diff is just a compare) is worth it.

## 4. Diff computation: client-side

The diff runs entirely on the frontend. Both version payloads are already fetched to display the read-only previews in the version panel. The diff is a pure function of these two objects - no server query is needed. Keeping it client-side makes the backend stateless for this feature and reduces API surface. The libraries involved (`fast-diff`) are under 5 KB. If version payloads grew to megabyte scale, I would move the diff to the backend and return a serialized diff structure instead.

## 5. Deployment and trickiest part

I deployed the backend on Render and PostgreSQL on Neon and the frontend on Vercel. The trickiest part was ensuring the `tsvector` trigger ran correctly on Neon's managed Postgres - the trigger function references `post_versions`, so the migration order mattered strictly (`post_versions` had to exist before the trigger was created).

## 6. One thing I would do differently

I would add optimistic locking on post saves from the start. Currently, if two browser tabs save simultaneously, the second write wins silently. Adding an `expected_version_num` parameter to the PUT endpoint - rejecting the save if it doesn't match the current latest version number - would prevent silent data loss and make the conflict visible to the user.
