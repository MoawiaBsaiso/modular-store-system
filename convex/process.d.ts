// Convex actions run in a Node.js-like environment that supports process.env
// but TypeScript doesn't know about it without @types/node.
// This declaration provides just what we need.
declare const process: {
  env: Record<string, string | undefined>
}
