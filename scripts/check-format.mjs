#!/usr/bin/env node

import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const write = process.argv.includes('--write');
const supported = /\.(?:cjs|css|html|js|json|md|mjs|scss|ts|vue|ya?ml)$/;
const alwaysCheck = [
  '.github/workflows/verify.yml',
  '.prettierrc',
  'AGENTS.md',
  'Dockerfile',
  'package.json',
  'scripts/check-bundle-budget.mjs',
  'scripts/check-format.mjs',
  'scripts/check-secrets.mjs',
  'scripts/check-source-assets.mjs',
  'vitest.config.ts',
];

function gitLines(args) {
  try {
    return execFileSync('git', args, { cwd: root, encoding: 'utf8' })
      .split('\n')
      .map((value) => value.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

function changedFiles() {
  const base = process.env.QUALITY_BASE_SHA;
  if (base && gitLines(['cat-file', '-e', `${base}^{commit}`]).length === 0) {
    try {
      execFileSync('git', ['cat-file', '-e', `${base}^{commit}`], { cwd: root });
      return gitLines(['diff', '--name-only', '--diff-filter=ACMR', `${base}...HEAD`]);
    } catch {
      // Fall through to local worktree detection when the CI base is unavailable.
    }
  }

  return [
    ...gitLines(['diff', '--name-only', '--diff-filter=ACMR', 'HEAD']),
    ...gitLines(['diff', '--cached', '--name-only', '--diff-filter=ACMR']),
    ...gitLines(['ls-files', '--others', '--exclude-standard']),
  ];
}

const files = [...new Set([...alwaysCheck, ...changedFiles()])]
  .filter((file) => supported.test(file))
  .filter((file) => existsSync(path.join(root, file)))
  .sort();

if (files.length === 0) {
  console.log('[format] No supported changed files to check.');
  process.exit(0);
}

const prettier = path.join(
  root,
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'prettier.cmd' : 'prettier',
);
const result = spawnSync(prettier, [write ? '--write' : '--check', ...files], {
  cwd: root,
  encoding: 'utf8',
  stdio: 'inherit',
});

process.exit(result.status ?? 1);
