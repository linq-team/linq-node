# Changelog

## 0.12.0 (2026-03-20)

Full Changelog: [v0.11.0...v0.12.0](https://github.com/linq-team/linq-node/compare/v0.11.0...v0.12.0)

### Features

* add per-line phone number filtering for webhook subscriptions ([18003b4](https://github.com/linq-team/linq-node/commit/18003b4c7ca529ff7377431f4d61dca2905aa76f))


### Bug Fixes

* return link part type in API responses and webhooks ([d193949](https://github.com/linq-team/linq-node/commit/d1939493874f4bbd02e13ef9f54c9a4f9b4b4179))

## 0.11.0 (2026-03-19)

Full Changelog: [v0.10.0...v0.11.0](https://github.com/linq-team/linq-node/compare/v0.10.0...v0.11.0)

### Features

* **api:** manual updates ([5b36092](https://github.com/linq-team/linq-node/commit/5b3609282b4f497340c66c5d2746f72513d7fd36))

## 0.10.0 (2026-03-19)

Full Changelog: [v0.9.0...v0.10.0](https://github.com/linq-team/linq-node/compare/v0.9.0...v0.10.0)

### Features

* **api:** update config ([8025138](https://github.com/linq-team/linq-node/commit/8025138a33d579a302785b711850dcad957730d8))

## 0.9.0 (2026-03-19)

Full Changelog: [v0.8.1...v0.9.0](https://github.com/linq-team/linq-node/compare/v0.8.1...v0.9.0)

### Features

* BUG: support rich media ddscan in links ([f3f8952](https://github.com/linq-team/linq-node/commit/f3f8952f7024a5038070edf07cfe3728d674fbec))
* PLT(Synapse): Add Content-Type validation for outbound presigned URL uploads ([343e03f](https://github.com/linq-team/linq-node/commit/343e03f0f63904c9c3c2f81ea9ebcfddd69c0e7d))

## 0.8.1 (2026-03-17)

Full Changelog: [v0.8.0...v0.8.1](https://github.com/linq-team/linq-node/compare/v0.8.0...v0.8.1)

### Bug Fixes

* enforce server-side authorization on DELETE /v3/messages/{messageId} ([45ce9ad](https://github.com/linq-team/linq-node/commit/45ce9ad9e4af4756da27009f7dbde012523017b1))
* **openapi:** correct schema errors and example inconsistencies ([b3a7d22](https://github.com/linq-team/linq-node/commit/b3a7d22064cc39fd7d00c66a85665bd5711b628f))


### Chores

* **internal:** tweak CI branches ([9b7ffaf](https://github.com/linq-team/linq-node/commit/9b7ffaf343497bd4298312a9de7312cdda8cf277))

## 0.8.0 (2026-03-12)

Full Changelog: [v0.7.1...v0.8.0](https://github.com/linq-team/linq-node/compare/v0.7.1...v0.8.0)

### Features

* make `from` optional on GET /v3/chats and add `to` filter ([b36752b](https://github.com/linq-team/linq-node/commit/b36752b991171ee984cc985e68dc8f82afc928e6))
* PDEV(Synapse): support markdown and text effects ([00dc922](https://github.com/linq-team/linq-node/commit/00dc922ef1cca534a50931d290c9b2e47b87772c))
* Plt 397 patch update contact card endpoint rename my cards endpoints ([4b64e37](https://github.com/linq-team/linq-node/commit/4b64e373c20408ebfb7a6ab8f9e32678115dd9de))


### Chores

* **internal:** update dependencies to address dependabot vulnerabilities ([19ceba3](https://github.com/linq-team/linq-node/commit/19ceba365cab72a999a5305be2566f8cdd5e216b))

## 0.7.1 (2026-03-10)

Full Changelog: [v0.7.0...v0.7.1](https://github.com/linq-team/linq-node/compare/v0.7.0...v0.7.1)

### Bug Fixes

* **client:** preserve URL params already embedded in path ([fd27237](https://github.com/linq-team/linq-node/commit/fd2723743ecb0a03a270f1de26d4c0bd4b6316f4))


### Chores

* **ci:** skip uploading artifacts on stainless-internal branches ([eb94f55](https://github.com/linq-team/linq-node/commit/eb94f55628d03dffa3fefde4c0551a3b1579b69f))

## 0.7.0 (2026-03-07)

Full Changelog: [v0.6.0...v0.7.0](https://github.com/linq-team/linq-node/compare/v0.6.0...v0.7.0)

### Features

* Programmatically update contact card ([2c59430](https://github.com/linq-team/linq-node/commit/2c59430e465275d8b572161355e511b4229780fa))


### Chores

* **internal:** codegen related update ([dcc3b3a](https://github.com/linq-team/linq-node/commit/dcc3b3a40e8079ea0d5180bc6f2be4d792b83830))

## 0.6.0 (2026-03-05)

Full Changelog: [v0.5.0...v0.6.0](https://github.com/linq-team/linq-node/compare/v0.5.0...v0.6.0)

### Features

* **api:** fix shared ([fe8b11c](https://github.com/linq-team/linq-node/commit/fe8b11c7975f53b21f21ec8f3c1ad748591b6a08))

## 0.5.0 (2026-03-05)

Full Changelog: [v0.4.0...v0.5.0](https://github.com/linq-team/linq-node/compare/v0.4.0...v0.5.0)

### Features

* **api:** update shared types ([6ccf1e2](https://github.com/linq-team/linq-node/commit/6ccf1e22548b58f44df3267db34369f1df29830c))

## 0.4.0 (2026-03-05)

Full Changelog: [v0.3.0...v0.4.0](https://github.com/linq-team/linq-node/compare/v0.3.0...v0.4.0)

### Features

* **api:** add new endpoint ([feaa645](https://github.com/linq-team/linq-node/commit/feaa645c6c2a9be7c596327f8ec25ac16f8ad352))

## 0.3.0 (2026-03-05)

Full Changelog: [v0.2.0...v0.3.0](https://github.com/linq-team/linq-node/compare/v0.2.0...v0.3.0)

### Features

* **api:** manual updates ([d22c7b7](https://github.com/linq-team/linq-node/commit/d22c7b7e2d9c50490831361d43320d050a103cdf))

## 0.2.0 (2026-03-05)

Full Changelog: [v0.1.5...v0.2.0](https://github.com/linq-team/linq-node/compare/v0.1.5...v0.2.0)

### Features

* Allow 100 presigned URL or uploaded attachments (URL + ID) in a message ([adb1e81](https://github.com/linq-team/linq-node/commit/adb1e812c68ab101e2f1362a3c53602dc9c589af))
* Plt 361 synapse support editing messages in v3 ([68d7b8a](https://github.com/linq-team/linq-node/commit/68d7b8afbc158ecb3fd0ce85e9ca8c0ad324b6bc))


### Bug Fixes

* remove unused part-level idempotency_key from OpenAPI spec ([24df345](https://github.com/linq-team/linq-node/commit/24df345db930e173b4618ce04819dd9dc021aa02))


### Chores

* **internal:** codegen related update ([3c28377](https://github.com/linq-team/linq-node/commit/3c283771a2d2ff459ed32f289d2e03fa379278af))
* **internal:** move stringifyQuery implementation to internal function ([b86f2c0](https://github.com/linq-team/linq-node/commit/b86f2c05a2c2e2b2ea4fe1df03c70b27f35def30))

## 0.1.5 (2026-02-24)

Full Changelog: [v0.1.4...v0.1.5](https://github.com/linq-team/linq-node/compare/v0.1.4...v0.1.5)

### Bug Fixes

* sendReaction OpenAPI spec returns 202 not 200 ([5d99f29](https://github.com/linq-team/linq-node/commit/5d99f29e57416f1ef5205938096f812e2d99154d))

## 0.1.4 (2026-02-24)

Full Changelog: [v0.1.3...v0.1.4](https://github.com/linq-team/linq-node/compare/v0.1.3...v0.1.4)

### Features

* **api:** add shared resource ([380a131](https://github.com/linq-team/linq-node/commit/380a131778f848b4801505a5058b368dcfe714d2))
* **api:** wtf ([f7e7689](https://github.com/linq-team/linq-node/commit/f7e76894338f764efdf980ac32768d96019a42c5))
* PLT: Include sticker details for iMessage tapback webhooks ([e219e9f](https://github.com/linq-team/linq-node/commit/e219e9fc8a6a52701cb2ec465de366c590815517))

## 0.1.3 (2026-02-24)

Full Changelog: [v0.1.2...v0.1.3](https://github.com/linq-team/linq-node/compare/v0.1.2...v0.1.3)

### Features

* **api:** add publish ([9985388](https://github.com/linq-team/linq-node/commit/9985388e902289caf832e5bd9ec679eea086babf))


### Chores

* update SDK settings ([5fcd66d](https://github.com/linq-team/linq-node/commit/5fcd66d24acb2d008474d5b286c2597e2f5642ce))
* update SDK settings ([ddbc1b9](https://github.com/linq-team/linq-node/commit/ddbc1b903f83f0b51b3ef0a411d738f002b6da88))

## 0.1.2 (2026-02-24)

Full Changelog: [v0.1.1...v0.1.2](https://github.com/linq-team/linq-node/compare/v0.1.1...v0.1.2)

### Features

* **api:** fix service type ([d0abbf2](https://github.com/linq-team/linq-node/commit/d0abbf2e3a3a85266215d01e6cd4268148c7d66d))

## 0.1.1 (2026-02-24)

Full Changelog: [v0.1.0...v0.1.1](https://github.com/linq-team/linq-node/compare/v0.1.0...v0.1.1)

### Features

* **api:** manual updates ([1e5a3c1](https://github.com/linq-team/linq-node/commit/1e5a3c15f90814f696548098570640d36aff3410))


### Chores

* remove custom code ([b0958ec](https://github.com/linq-team/linq-node/commit/b0958ec1385f9bb1fa946f2948fee08055adfb22))
* update SDK settings ([f6da0a0](https://github.com/linq-team/linq-node/commit/f6da0a0623ff711f92744872d079f4de903c7613))

## 0.1.0 (2026-02-23)

Full Changelog: [v0.0.1...v0.1.0](https://github.com/linq-team/linq-node/compare/v0.0.1...v0.1.0)

### Features

* Add Stainless SDK build to OpenAPI workflow ([7d710e6](https://github.com/linq-team/linq-node/commit/7d710e615b08c3294ffa35091557bf360193af55))
* **api:** api update ([0a6d75d](https://github.com/linq-team/linq-node/commit/0a6d75d3e35aabac4843629852ebc23bd091c192))
* **api:** api update ([b921025](https://github.com/linq-team/linq-node/commit/b921025a36162f324395253939647b1d2a5461b9))
* **api:** api update ([593b266](https://github.com/linq-team/linq-node/commit/593b266a51ec44bc4ddbe893ae08ed0ce254375e))
* **api:** api update ([e6642f4](https://github.com/linq-team/linq-node/commit/e6642f4bc9520fb92433cd25ec78d1abf3392c03))
* deprecate /phonenumbers in favor of /phone_numbers endpoint ([91f4b97](https://github.com/linq-team/linq-node/commit/91f4b97af63525cc1089c6340ced767cda7d81c8))
* enable documented OpenAPI spec with SDK code samples ([3dde73c](https://github.com/linq-team/linq-node/commit/3dde73cadb43e86fec82a805551b79c9aa234f71))
* enable OIDC trusted publishing and npm provenance ([b372e1c](https://github.com/linq-team/linq-node/commit/b372e1c4f984aef4d73a60fbd0b699d51fee397d))
* switch npm publishing to OIDC trusted publishing ([52954e8](https://github.com/linq-team/linq-node/commit/52954e82b349c631a118a4e921eab7be5e9f670a))


### Bug Fixes

* configure OIDC publishing and fix chat list test examples ([fc00a34](https://github.com/linq-team/linq-node/commit/fc00a344a1d32b9dead7318b89b565af7f273a76))
* remove NPM_TOKEN requirement from release-doctor, add provenance ([bfe16fe](https://github.com/linq-team/linq-node/commit/bfe16fe2cebedab7d3c8733fd4c7b477a108c05a))
* remove provenance flag for private repo publishing ([3ae4be7](https://github.com/linq-team/linq-node/commit/3ae4be7539d46672439d540c58ba011cb3f58e1e))
* restore correct stainless config ([f092ae5](https://github.com/linq-team/linq-node/commit/f092ae5f133a2226abddec4565892be91a96afb1))
* restore setup-node v4 and registry-url in publish workflow ([50f11ea](https://github.com/linq-team/linq-node/commit/50f11ea701b3e7ec5342f316146cfdd15bcaafc8))
* update organization docs URL to apidocs.linqapp.com ([4ad2b90](https://github.com/linq-team/linq-node/commit/4ad2b900f779bfe4e18b403cd90ff9a0a46020da))


### Chores

* **internal/client:** fix form-urlencoded requests ([dd2b7f6](https://github.com/linq-team/linq-node/commit/dd2b7f67a9acdbffd96c8f6e3a45e6860b498e3f))
* sync repo ([a780316](https://github.com/linq-team/linq-node/commit/a7803164fb5f12afdec8ed51c35003307a14b480))
* update SDK settings ([d176c25](https://github.com/linq-team/linq-node/commit/d176c255fc623ab12aa74ea5bf00262ce633a81b))
* update SDK settings ([b61c9ee](https://github.com/linq-team/linq-node/commit/b61c9ee72f8700531c70ac3161bbe0dbeb1cde61))
* update SDK settings ([cdc73fc](https://github.com/linq-team/linq-node/commit/cdc73fccde19ba94d27de4ae2b31c48d18627756))


### Documentation

* add CLAUDE.md and .stainless/ workspace config ([82b2491](https://github.com/linq-team/linq-node/commit/82b2491bf0ee34e9ce6b6d1bff6705ab581c7e95))
* note contact card setup required for share_contact_card endpoint ([2c8c39f](https://github.com/linq-team/linq-node/commit/2c8c39f99ac55620f5d13e4a2349d046db7c8f45))
