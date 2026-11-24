---
ticket: linqn-303
concepts: []
new_concepts: []
paths:
  - .github/workflows/ci.yml
  - plans/linqn-303.md
contracts_changed:
  - 'CI: new aggregate check named `ci` (becomes the required check in on-354)'
acceptance:
  - 'ci.yml defines a job with `name: ci` that `needs: [lint, build]` and runs with `if: always()` under the same event gating as lint and build'
  - "The `ci` job exits non-zero when any needed job's result is failure or cancelled, and exits zero when all are success or skipped"
  - 'This PR (same-repo, to main) shows exactly one check named `ci`, and it passes'
tests: []
decisions:
  - q: "lint and build only run on push events (or on PRs from forks); a same-repo PR's checks come from the branch's push run. Where does `ci` run?"
    options:
      - 'A: same gating as lint/build (push, or fork PR). Exactly one `ci` per head SHA, always backed by real results. Same-repo PRs get `ci` via the push run.'
      - 'B: run on every pull_request too. A same-repo PR gets a second `ci` from the pull_request run whose needs were all skipped, so it passes vacuously and could satisfy the required check.'
      - "C: change lint/build to also run on same-repo PRs to main. Doubles CI runs and edits Stainless-generated job conditions, outside this ticket's scope."
    recommend: 'A'
    why: 'Only option where a `ci` check on the PR can never pass without lint and build having run, with no change to existing jobs.'
epic:
---

Append one job to `.github/workflows/ci.yml`:

```yaml
ci:
  name: ci
  needs: [lint, build]
  if: always() && <same condition as lint/build>
  runs-on: ubuntu-latest
  steps:
    - fail if any of needs.*.result is failure or cancelled
```

Skipped needs count as passing, so `codegen metadata` commits (where lint/build skip) don't block.
Release PRs are pushed with RELEASE_PLEASE_TOKEN, so their push runs trigger and produce `ci` too.
