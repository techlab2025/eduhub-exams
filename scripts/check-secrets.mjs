#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const root = process.cwd();
const files = execFileSync('git', ['ls-files'], { cwd: root, encoding: 'utf8' })
  .split('\n')
  .filter((file) =>
    /(?:^|\/)(?:Dockerfile|\.env[^/]*)$|\.(?:cjs|js|json|md|mjs|ts|vue|ya?ml)$/.test(file),
  )
  .filter((file) => existsSync(file))
  .filter((file) => file !== 'scripts/check-secrets.mjs');

const patterns = [
  { name: 'private key', expression: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
  { name: 'bearer credential', expression: /Bearer\s+[A-Za-z0-9._~-]{24,}/i },
  {
    name: 'JWT-shaped credential',
    expression: /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/,
  },
  {
    name: 'assigned credential',
    expression:
      /(?:api[_-]?key|access[_-]?token|client[_-]?secret|password)\s*[:=]\s*['"][^'"${}]{16,}['"]/i,
  },
];

const findings = [];
for (const file of files) {
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, index) => {
    for (const pattern of patterns) {
      if (pattern.expression.test(line)) {
        findings.push(`${file}:${index + 1} (${pattern.name})`);
      }
    }
  });
}

if (findings.length > 0) {
  console.error(
    '[security] Potential committed credentials found. Values are intentionally redacted:',
  );
  findings.forEach((finding) => console.error(`  ${finding}`));
  process.exit(1);
}

console.log(
  `[security] Checked ${files.length} tracked text files; no credential pattern matched.`,
);
