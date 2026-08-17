#!/usr/bin/env node

import { gzipSync } from 'node:zlib';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const root = path.join(process.cwd(), 'dist');

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

let files;
try {
  files = walk(root);
} catch {
  console.error('[bundle] dist/ is missing. Run npm run build before the bundle check.');
  process.exit(1);
}

const metrics = files.map((file) => {
  const bytes = readFileSync(file);
  return {
    file: path.relative(root, file),
    raw: statSync(file).size,
    gzip: gzipSync(bytes).length,
  };
});

const sum = (extension, field) =>
  metrics
    .filter((metric) => metric.file.endsWith(extension))
    .reduce((total, metric) => total + metric[field], 0);
const totals = {
  raw: metrics.reduce((total, metric) => total + metric.raw, 0),
  gzip: metrics.reduce((total, metric) => total + metric.gzip, 0),
  jsGzip: sum('.js', 'gzip'),
  cssGzip: sum('.css', 'gzip'),
};

// Verified Phase 0 baseline ceilings. Phase 1 replaces these aggregate guards
// with initial-route and lazy-route budgets after avoidable bytes are removed.
const limits = {
  raw: 56_000_000,
  gzip: 51_000_000,
  jsGzip: 4_200_000,
  cssGzip: 250_000,
};
const failures = Object.entries(limits).filter(([key, limit]) => totals[key] > limit);

console.log(JSON.stringify({ totals, limits }, null, 2));
if (failures.length > 0) {
  failures.forEach(([key, limit]) =>
    console.error(`[bundle] ${key} is ${totals[key]} bytes; Phase 0 ceiling is ${limit} bytes.`),
  );
  process.exit(1);
}

console.log('[bundle] Phase 0 non-regression budgets passed.');
