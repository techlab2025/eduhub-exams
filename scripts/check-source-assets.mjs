#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';

const root = process.cwd();
const files = execFileSync('git', ['ls-files', 'src'], { cwd: root, encoding: 'utf8' })
  .split('\n')
  .filter((file) => file && existsSync(file));

// Phase 0 prevents growth beyond the verified legacy baseline. Phase 1 replaces
// these temporary ceilings with the approved 500 KB / 10 KB / 250 KB budgets.
const limits = {
  sourceBytes: 10_000_000,
  embeddedImageBytes: 10_000_000,
  rasterBytes: 8_000_000,
  animatedBytes: 8_000_000,
};

const failures = [];
let embeddedCount = 0;
let oversizedSourceCount = 0;

for (const file of files) {
  const size = statSync(file).size;
  if (/\.(?:ts|vue)$/.test(file) && size > 500_000) {
    oversizedSourceCount += 1;
    if (size > limits.sourceBytes) failures.push(`${file} exceeds the Phase 0 source ceiling`);
  }

  if (/\.(?:gif)$/i.test(file) && size > limits.animatedBytes) {
    failures.push(`${file} exceeds the Phase 0 animated-asset ceiling`);
  } else if (/\.(?:jpe?g|png|webp)$/i.test(file) && size > limits.rasterBytes) {
    failures.push(`${file} exceeds the Phase 0 raster-asset ceiling`);
  }

  if (/\.(?:css|scss|ts|vue)$/.test(file)) {
    const source = readFileSync(file, 'utf8');
    for (const match of source.matchAll(/data:image\/[a-z0-9.+-]+;base64,([a-z0-9+/=]+)/gi)) {
      const bytes = Math.floor((match[1].length * 3) / 4);
      embeddedCount += 1;
      if (bytes > limits.embeddedImageBytes) {
        failures.push(`${file} contains an embedded image above the Phase 0 ceiling`);
      }
    }
  }
}

if (failures.length > 0) {
  failures.forEach((failure) => console.error(`[assets] ${failure}`));
  process.exit(1);
}

console.log(
  `[assets] Phase 0 non-regression guard passed; legacy inventory: ${oversizedSourceCount} source files over 500 KB and ${embeddedCount} embedded images.`,
);
