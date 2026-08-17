# Pull-request protection

Protect the production branch in the repository host with these settings:

- Require pull requests and at least one approving review.
- Require the `verify / quality` status check to pass and be current with the target branch.
- Require conversation resolution and prevent force pushes and branch deletion.
- Apply the rule to administrators unless an audited emergency process explicitly overrides it.

The workflow is the release boundary; Husky hooks provide local feedback only. CI and local development both use Node `22.22.0`, npm `10.9.4`, `npm ci`, and the repository scripts from `package.json`.

If a credential was ever committed, replacing the fixture does not revoke it. The owner of the corresponding backend or external service must rotate it and review access logs outside this frontend repository.
