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
  - 'lint and build run on every pull_request event (not only fork PRs), still skipping `codegen metadata` pushes'
  - 'ci.yml defines a job with `name: ci` that `needs: [lint, build]` and runs with `if: always()` and no event gating'
  - "The `ci` job exits non-zero when any needed job's result is failure or cancelled, and exits zero when all are success or skipped"
  - 'Every `ci` check on this PR (push run and pull_request run) completes as success, none skipped'
tests: []
decisions:
  - q: "lint and build only run on push events (or on PRs from forks); a same-repo PR's checks come from the branch's push run. Where does `ci` run?"
    options:
      - 'A: same gating as lint/build (push, or fork PR). Exactly one `ci` per head SHA, always backed by real results. Same-repo PRs get `ci` via the push run.'
      - 'B: run on every pull_request too. A same-repo PR gets a second `ci` from the pull_request run whose needs were all skipped, so it passes vacuously and could satisfy the required check.'
      - 'C: run lint/build on every pull_request event (any base branch except stl-preview-*), and run `ci` after them in every run. Same-repo PRs run lint/build twice (push and pull_request). Edits Stainless-generated job conditions, which a future regeneration could revert.'
    recommend: 'C'
    why: 'A was tried on #316: the pull_request run still produced a skipped `ci` check, and skipped can satisfy a required check. C makes every `ci` check reflect real lint/build results. User approved C on 2026-11-24.'
    supersedes: []
epic:
---

Append one job to `.github/workflows/ci.yml`:

```yaml
ci:
  name: ci
  needs: [lint, build]
  if: always()
  runs-on: ubuntu-latest
  steps:
    - fail if any of needs.*.result is failure or cancelled
```

Skipped needs count as passing, so `codegen metadata` commits (where lint/build skip) don't block.
lint/build gating drops the fork-only restriction for pull_request events.
Release PRs are pushed with RELEASE_PLEASE_TOKEN, so their push runs trigger and produce `ci` too.
