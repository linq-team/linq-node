# Changelog

## [0.39.3](https://github.com/linq-team/linq-node/compare/v0.39.2...v0.39.3) (2026-08-17)


### Bug Fixes

* clarify poll webhook added_options field behavior ([7e9ad29](https://github.com/linq-team/linq-node/commit/7e9ad2927d49cf7401a2436b2a40137f4277bbc5))

## [0.39.2](https://github.com/linq-team/linq-node/compare/v0.39.1...v0.39.2) (2026-08-15)


### Bug Fixes

* **mcp-server:** drop the unused jq-web dependency ([#127](https://github.com/linq-team/linq-node/issues/127)) ([3231420](https://github.com/linq-team/linq-node/commit/32314209e71aa89268c8566c1944849b69eb1ef4))

## [0.39.1](https://github.com/linq-team/linq-node/compare/v0.39.0...v0.39.1) (2026-08-15)


### Bug Fixes

* **mcp-server:** serve jq-web from cdn.linqapp.com instead of stainless-api ([#124](https://github.com/linq-team/linq-node/issues/124)) ([705a775](https://github.com/linq-team/linq-node/commit/705a775b7c13671215c57f8227d119cf5f917c33))

## [0.39.0](https://github.com/linq-team/linq-node/compare/v0.38.1...v0.39.0) (2026-08-14)


### Features

* add chat background and poll features ([562dc8d](https://github.com/linq-team/linq-node/commit/562dc8dd954530102a3e40f3e10d2c86d8656e8d))

## [0.38.1](https://github.com/linq-team/linq-node/compare/v0.38.0...v0.38.1) (2026-08-14)


### Bug Fixes

* clarify chat health status guidance and opt-out behavior ([9a1f3ee](https://github.com/linq-team/linq-node/commit/9a1f3ee15143d3b2743ff1a25f3aa0774da74a47))

## [0.38.0](https://github.com/linq-team/linq-node/compare/v0.37.1...v0.38.0) (2026-08-14)


### Features

* add 403 error responses for ineligible phone numbers ([1c350e1](https://github.com/linq-team/linq-node/commit/1c350e1bac2a691975c9dbdabedecce7d8d4acce))

## [0.37.1](https://github.com/linq-team/linq-node/compare/v0.37.0...v0.37.1) (2026-08-13)


### Bug Fixes

* clarify address format requirements for messaging checks ([bda9bb0](https://github.com/linq-team/linq-node/commit/bda9bb0c0ffa6d3022dcf63f1c74566b3b26c325))

## [0.37.0](https://github.com/linq-team/linq-node/compare/v0.36.1...v0.37.0) (2026-08-13)


### Features

* add detailed 503 errors and response fields for capability checks ([eda6a4a](https://github.com/linq-team/linq-node/commit/eda6a4a70b0c488e0f9f802084e98c3f728e384f))

## [0.36.1](https://github.com/linq-team/linq-node/compare/v0.36.0...v0.36.1) (2026-08-12)


### Chores

* reorder language examples in api documentation ([63795ce](https://github.com/linq-team/linq-node/commit/63795cec7854e31512a481b2ef4a32c7b9bfb90d))


### Documentation

* add parameter descriptions for phone number audit endpoints ([63795ce](https://github.com/linq-team/linq-node/commit/63795cec7854e31512a481b2ef4a32c7b9bfb90d))

## [0.36.0](https://github.com/linq-team/linq-node/compare/v0.35.1...v0.36.0) (2026-08-12)


### Features

* add experiences api for native imessage cards ([5659895](https://github.com/linq-team/linq-node/commit/5659895f4c79f83f1e3fda3c094a5127301b9312))
* add line reputation audit endpoints and report types ([5659895](https://github.com/linq-team/linq-node/commit/5659895f4c79f83f1e3fda3c094a5127301b9312))
* rename agentkit to experience in card api ([5659895](https://github.com/linq-team/linq-node/commit/5659895f4c79f83f1e3fda3c094a5127301b9312))


### Bug Fixes

* add example responses and parameter descriptions to experiences endpoints ([5659895](https://github.com/linq-team/linq-node/commit/5659895f4c79f83f1e3fda3c094a5127301b9312))
* clarify api endpoints in documentation examples ([5659895](https://github.com/linq-team/linq-node/commit/5659895f4c79f83f1e3fda3c094a5127301b9312))

## [0.35.1](https://github.com/linq-team/linq-node/compare/v0.35.0...v0.35.1) (2026-08-10)


### Chores

* reorder sdk code examples by language ([7fdd4a2](https://github.com/linq-team/linq-node/commit/7fdd4a2488c2d022bc744ba499bfe7441e44894c))

## [0.35.0](https://github.com/linq-team/linq-node/compare/v0.34.0...v0.35.0) (2026-08-10)


### Features

* add blocked handles api for managing inbound message filtering ([4b16792](https://github.com/linq-team/linq-node/commit/4b16792a99e2956cfa2ef9fee5f3156b172aaa5c))
* add diagnostic fields to message failure webhook events ([4b16792](https://github.com/linq-team/linq-node/commit/4b16792a99e2956cfa2ef9fee5f3156b172aaa5c))
* regenerate SDKs from updated API spec ([4b16792](https://github.com/linq-team/linq-node/commit/4b16792a99e2956cfa2ef9fee5f3156b172aaa5c))


### Bug Fixes

* clarify opted-out status clearing behavior in chat health ([4b16792](https://github.com/linq-team/linq-node/commit/4b16792a99e2956cfa2ef9fee5f3156b172aaa5c))
* clarify stop keyword behavior and matching rules ([4b16792](https://github.com/linq-team/linq-node/commit/4b16792a99e2956cfa2ef9fee5f3156b172aaa5c))
* clarify stop keyword behavior for multi-chat replies ([4b16792](https://github.com/linq-team/linq-node/commit/4b16792a99e2956cfa2ef9fee5f3156b172aaa5c))
* expand webhook error code documentation for failure events ([4b16792](https://github.com/linq-team/linq-node/commit/4b16792a99e2956cfa2ef9fee5f3156b172aaa5c))


### Documentation

* clarify presigned url behavior and configuration ([4b16792](https://github.com/linq-team/linq-node/commit/4b16792a99e2956cfa2ef9fee5f3156b172aaa5c))

## [0.34.0](https://github.com/linq-team/linq-node/compare/v0.33.1...v0.34.0) (2026-08-05)


### Features

* add blocked handles api for message filtering ([6f0dd0b](https://github.com/linq-team/linq-node/commit/6f0dd0ba6bc16a9e0e5ef531e70753b49a944aee))

## [0.33.1](https://github.com/linq-team/linq-node/compare/v0.33.0...v0.33.1) (2026-08-04)


### Bug Fixes

* flatten poll subresources to avoid go compile errors ([bbc72a4](https://github.com/linq-team/linq-node/commit/bbc72a41cc22a04ce5af33c9378c03394a547382))

## [0.33.0](https://github.com/linq-team/linq-node/compare/v0.32.1...v0.33.0) (2026-08-04)


### Features

* add action field to message content for in-app experiences ([3d72197](https://github.com/linq-team/linq-node/commit/3d72197fd2e95680341decbba72a40ecd17daa5c))
* add agentcard payment provider api ([3d72197](https://github.com/linq-team/linq-node/commit/3d72197fd2e95680341decbba72a40ecd17daa5c))
* add exclude_from parameter to control line selection ([3d72197](https://github.com/linq-team/linq-node/commit/3d72197fd2e95680341decbba72a40ecd17daa5c))
* add reconciled_at field to message objects ([3d72197](https://github.com/linq-team/linq-node/commit/3d72197fd2e95680341decbba72a40ecd17daa5c))
* support url-type fields in message action parameters ([3d72197](https://github.com/linq-team/linq-node/commit/3d72197fd2e95680341decbba72a40ecd17daa5c))


### Bug Fixes

* clarify contact card creation and update behavior ([3d72197](https://github.com/linq-team/linq-node/commit/3d72197fd2e95680341decbba72a40ecd17daa5c))
* clarify idempotency key behavior with deleted messages ([3d72197](https://github.com/linq-team/linq-node/commit/3d72197fd2e95680341decbba72a40ecd17daa5c))
* clarify message.failed webhook delivery behavior ([3d72197](https://github.com/linq-team/linq-node/commit/3d72197fd2e95680341decbba72a40ecd17daa5c))
* clarify opt-out keyword matching requirements for chat health ([3d72197](https://github.com/linq-team/linq-node/commit/3d72197fd2e95680341decbba72a40ecd17daa5c))

## [0.32.1](https://github.com/linq-team/linq-node/compare/v0.32.0...v0.32.1) (2026-07-27)


### Documentation

* restructure README around getting started ([#96](https://github.com/linq-team/linq-node/issues/96)) ([1c41047](https://github.com/linq-team/linq-node/commit/1c41047b8c112a1a143f87886013d05093e03478))

## [0.32.0](https://github.com/linq-team/linq-node/compare/v0.31.0...v0.32.0) (2026-07-27)


### Features

* add action field to message content for app experiences ([171757e](https://github.com/linq-team/linq-node/commit/171757e83e40a28fee7ff50c3efd1267ce8d3e9b))

## [0.31.0](https://github.com/linq-team/linq-node/compare/v0.30.0...v0.31.0) (2026-07-26)


### Features

* regenerate SDKs from updated API spec ([#92](https://github.com/linq-team/linq-node/issues/92)) ([969edb3](https://github.com/linq-team/linq-node/commit/969edb38ecac7587e86de9e81213034c3dd8a4a5))

## [0.30.0](https://github.com/linq-team/linq-node/compare/v0.29.0...v0.30.0) (2026-07-26)


### Features

* regenerate SDKs from updated API spec ([#90](https://github.com/linq-team/linq-node/issues/90)) ([488bdbb](https://github.com/linq-team/linq-node/commit/488bdbb52804456e950bc71de5df5a8fdba88dd1))

## [0.29.0](https://github.com/linq-team/linq-node/compare/v0.28.2...v0.29.0) (2026-07-24)


### Features

* add natural payment rail support with e.164 identifiers ([#86](https://github.com/linq-team/linq-node/issues/86)) ([567485d](https://github.com/linq-team/linq-node/commit/567485d1cf340d6fa37759abaf17e9daeec270de))

## [0.28.2](https://github.com/linq-team/linq-node/compare/v0.28.1...v0.28.2) (2026-07-06)


### Bug Fixes

* **mcp-server:** unblock code execute tool on modern Deno ([#84](https://github.com/linq-team/linq-node/issues/84)) ([f8bdf2d](https://github.com/linq-team/linq-node/commit/f8bdf2d6f3b737a5ede4ae62f34f556700447969))

## [0.28.1](https://github.com/linq-team/linq-node/compare/v0.28.0...v0.28.1) (2026-07-06)


### Documentation

* clarify phone line reputation status descriptions ([#82](https://github.com/linq-team/linq-node/issues/82)) ([7110051](https://github.com/linq-team/linq-node/commit/711005190d8b80f6187cba2e2ddef4bf37027498))

## [0.28.0](https://github.com/linq-team/linq-node/compare/v0.27.1...v0.28.0) (2026-06-21)


### Features

* phone line reputation + group chat icon ([#79](https://github.com/linq-team/linq-node/issues/79)) ([8964a11](https://github.com/linq-team/linq-node/commit/8964a1129bce0b216363dc9f3cd7f47a1c5c47e9))

## [0.27.1](https://github.com/linq-team/linq-node/compare/v0.27.0...v0.27.1) (2026-06-10)


### Bug Fixes

* **ci:** parse release PR number in shell, not fromJSON in env ([#73](https://github.com/linq-team/linq-node/issues/73)) ([8ce6fe2](https://github.com/linq-team/linq-node/commit/8ce6fe29defadd71b74ee4a3a4a298be6e51f09e))
* regenerate SDKs from updated API spec ([#76](https://github.com/linq-team/linq-node/issues/76)) ([1914512](https://github.com/linq-team/linq-node/commit/1914512d137a525a2b49f3c7570fd406bb7e49f8))
