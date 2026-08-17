# EduHub Exams

## Runtime

Use Node `22.22.0`, npm `10.9.4`, and the committed `package-lock.json`. Both `.nvmrc` and `.node-version` select the supported Node release.

```bash
nvm use
npm --version
npm ci
```

The npm version must print `10.9.4`. Install that version explicitly if the local Node distribution provides a different npm release.

## Development and verification

```bash
npm run dev
npm run verify
```

`npm run verify` is the authoritative local release gate. Its check commands do not edit the worktree. Use the explicit `*:fix` scripts only when you intend to apply formatting or lint fixes.
