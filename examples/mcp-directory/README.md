# Linq MCP directory submissions

Uses the existing official `@linqapp/sdk-mcp` server and the existing [Linq plugin](https://github.com/linq-team/linq-ai). No additional server or shared Linq account is introduced.

## Review and release sequence

1. Review the package ownership marker (`mcpName`) and registry manifest in this PR.
2. Release the MCP npm package through the existing SDK release pipeline. **The currently published package may not carry the new ownership marker. Do not try publishing this manifest before the marker ships.**
3. After the release updates `packages/mcp-server/package.json`, run `node examples/mcp-directory/sync-manifest.mjs` and commit the version change. CI rejects stale manifest versions.
4. Verify the published version, not just this source checkout: `npm view @linqapp/sdk-mcp@VERSION mcpName` must print `io.github.linq-team/linq`. Inspect its npm tarball and run the smoke test below.
5. A Linq GitHub organization owner authenticates with an appropriately scoped token (classic PAT: `read:org`; fine-grained PAT: organization Members read), using `mcp-publisher login github --token "$MCP_GITHUB_TOKEN"`, then `mcp-publisher publish examples/mcp-directory/server.json` using the [official publisher](https://github.com/modelcontextprotocol/registry/blob/main/docs/modelcontextprotocol-io/quickstart.mdx). Confirm the live registry entry matches the npm version.
6. Submit the Claude plugin and Glama listing below. Keep their status pending until the destination confirms receipt/approval.

This PR does not publish npm, register an MCP server, deploy an endpoint, or submit a directory listing.

## Official MCP Registry

`server.json` describes the **local stdio package**, with the API key provided separately by each user. No remote URL is invented. The registry checks package ownership using the `mcpName` npm field.

Validation: `node --test examples/mcp-directory/test/*.test.mjs`.

## Claude directory

Submit through https://claude.ai/directory/manage/new using the **plugin bundle** route:

- Name: Linq
- Repository: https://github.com/linq-team/linq-ai
- Description: Build and operate iMessage, RCS, and SMS integrations with Linq. Includes API guidance, integration checks, and authenticated MCP access.
- Documentation: https://docs.linqapp.com
- Website: https://linqapp.com
- Support: contact@linqapp.com
- Authentication: each user installs the Linq CLI and signs into their own account; see the plugin README. No credentials belong in the submitted repository or form description.

The existing plugin manifest is `.claude-plugin/plugin.json`, and its `mcp.json` launches `@linqapp/sdk-mcp`. Submit this existing bundle, not a fictitious hosted MCP connector. A paid Claude account and directory review are required. If the portal does not accept this local-MCP bundle, stop and record the exact requirement; a hosted connector would be a separate deployment/authentication project. Confirm the privacy-policy/terms fields against the company's current published policies when filling the portal.

## Glama

Use https://glama.ai/mcp/servers → Add MCP Server. Submit the public repository `https://github.com/linq-team/linq-node`, point reviewers to `packages/mcp-server`, and use the name/description from `server.json`. It is a Node.js stdio server; run `npx -y @linqapp/sdk-mcp@VERSION` with the caller's `LINQ_API_V3_API_KEY`. If Glama requires a build configuration for the monorepo, use its hosted-connector path only after a separately reviewed hosted deployment exists; do not give it a production account or publish a shared key.

## Credential-free smoke test

Run `node examples/mcp-directory/smoke.mjs` to test the exact npm version declared in `server.json`. The script initializes MCP, lists `search_docs` and `execute`, searches local SDK docs, and runs a pure arithmetic expression in the sandbox with a placeholder credential. It does not use live customer credentials or call messaging APIs. It installs/runs the published package, not this source checkout. The existing linq-ai CI separately tests the latest published version.

## Ongoing ownership

The release-please configuration updates both registry version fields alongside the MCP package version. SDK generation removed these files and the npm ownership marker after 0.79.0; keep this directory, the two registry workflows, and `mcpName` when applying generated SDK updates. The restored CI check validates their agreement. SDK releases must keep the registry manifest version in sync. Only re-submit directory changes after validating the released package. Review tools and permission behavior when new SDK actions ship: the `execute` tool can perform writes authorized by the user's Linq key.

## GitHub OIDC publication

The `Publish MCP Registry` workflow publishes from `main` without a personal GitHub token. Configure the `mcp-registry-release` environment for protected branches, then dispatch `publish-mcp-registry.yml` with the exact released version. It verifies the manifest against npm's published ownership marker, runs the exact-version MCP smoke test, checks the publisher binary's pinned SHA-256, and authenticates with GitHub OIDC. It refuses a version mismatch before authenticating or publishing.
