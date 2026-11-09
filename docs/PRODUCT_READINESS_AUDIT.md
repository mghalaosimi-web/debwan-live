# Debwan Live — Phase 0 Product Readiness Audit

**Status:** Preliminary static-code audit  
**Branch:** `audit/phase-0-product-readiness`  
**Scope:** Repository structure, documented API surface, selected frontend/backend source files, Android Gradle configuration, and CI workflow.  
**Important:** This document records source-level evidence only. It does not claim that production services, external media sources, or real playback have been exercised.

## Executive summary

The repository is a substantial self-hosted IPTV/VOD foundation. It contains a Go/Fiber backend, Next.js frontend, native Kotlin/Jetpack Compose Android client, PostgreSQL, Redis, Nginx, FFmpeg integration, HLS playback dependencies, M3U/XMLTV import paths, EPG, VOD/series catalog, user favorites/history, and Xtream-compatible endpoints.

It is **not yet verified as a consumer-ready Debwan Live service comparable in user experience to Syria Live or Yacine TV**. The strongest gap is the product layer and content/data supply: sports fixtures/results/provider integration are not represented in the documented API or the inspected frontend navigation; the current home page is a small authenticated dashboard rather than a discovery-led streaming home; Arabic/RTL is not present in the inspected i18n configuration.

## Evidence-based inventory

| Area | Source-level evidence | Preliminary status | What remains unverified |
|---|---|---|---|
| Backend | `backend/internal/router/router.go`, `backend/internal/handler/channel.go`, `backend/internal/handler/iptv.go` | Implemented in source | Runtime/API integration and edge cases |
| M3U import | `backend/internal/service/iptv_seeder.go`, `backend/internal/handler/iptv.go` | Import path and filters exist | Import against approved real lists; source health and scale |
| XMLTV/EPG | `iptv_seeder.go`, `backend/internal/service/epg.go`, EPG handler/routes | XMLTV structures and EPG service exist | Timezone correctness, refresh scheduling, matching quality, real feed |
| Web channel catalog | `frontend/src/app/(user)/channels/page.tsx` | Listing, category selection, search, polling for live IDs | Full user journeys and data-backed rendering |
| Web channel playback | `frontend/src/app/(user)/channels/[id]/page.tsx` | hls.js integration and stream selection exist | Real HLS playback, retry/fallback correctness, browser/device matrix |
| VOD and series | `frontend/src/app/(user)/vod/page.tsx`, `series/page.tsx`, API docs | Catalog UI/API paths exist | Upload/transcode/playback end-to-end |
| Android | `docs/ANDROID.md`, `android/app/build.gradle.kts` | Native client and Media3/ExoPlayer dependencies documented/configured | Install and playback on physical phone and Android TV |
| Admin | `frontend/src/app/admin/page.tsx`, backend admin routes | Dashboard and CRUD API surface documented | Every admin workflow and authorization boundary |
| Sports | API reference and inspected navigation/routes | No sports/matches/fixtures API or page found in inspected scope | Full repository scan still required |
| Arabic/RTL | `frontend/src/lib/i18n.ts`, `frontend/src/app/layout.tsx` | Spanish and English resources; root HTML language is Spanish | Arabic translation and RTL implementation absent from inspected setup |
| CI | `.github/workflows/ci.yml` | Build/test pipeline defined | Latest run must be rechecked after changes; Android lint is non-blocking |

## Confirmed product gaps from inspected source

### 1. Home/discovery experience

The current `(user)/home/page.tsx` fetches continue-watching items and renders three navigation tiles (channels, VOD, series). It does not currently implement the full discovery experience requested for Debwan Live: featured live channels, sports fixtures, curated rows, trending/recent collections, country/category discovery, or a rich hero area.

The root page redirects unauthenticated visitors to `/login`, and the user layout also enforces authentication. A public browse/preview mode is therefore not present in the inspected flow. Product decision: determine whether Debwan should remain private/subscriber-only or allow public catalog discovery with playback gated by authorization.

### 2. Sports and match data

The inspected API reference exposes channels, VOD, series, categories, EPG, favorites, history, search, and admin content operations. No sports fixtures, competitions, teams, scores, or sports provider integration is described there. This is a genuine product capability gap, not a matter of styling.

Required future module: sports data provider adapter, normalized competition/team/event models, timezone-aware schedule, status/score updates, and optional lawful event-stream association. No match or stream data should be fabricated.

### 3. Arabic and RTL

The inspected i18n setup imports only `es` and `en`; the root document uses `lang="es"`. The user-facing product requires Arabic as a first-class language with RTL layout, while retaining English and optionally Spanish. This must be implemented consistently across layout, player controls, admin screens, dates, forms, and navigation.

### 4. Playback resiliency

The channel detail page uses hls.js and selects a single preferred active stream by priority (live emission first, then HLS, then any active stream). Fatal media errors attempt recovery; network errors show a retry message. The inspected code does not yet establish a complete verified failover sequence across all alternate stream records. This needs dedicated playback-state logic and tests before calling it automatic source failover.

### 5. Naming and localization residue

Several inspected files still use the upstream label in browser document titles or translation storage keys, e.g. `TIVIFY` in the channel/VOD/series page title suffix and `tivify_lang` in i18n localStorage detection. Android namespace/applicationId remains `com.tivify.app`. These are not all equally safe to rename: Android applicationId changes can affect upgrade compatibility. Treat them as a controlled identity migration, not a blind global replacement.

## External dependencies and operating requirements

- Authorized media sources for live channels and VOD; the repository does not include broadcast rights, paid subscriptions, or a ready-made licensed catalog.
- XMLTV/EPG provider or permitted feed.
- Sports-data provider/API for fixtures, competitions, status, and scores.
- TMDB API key or another metadata source used under its applicable terms.
- A production host sized from measured concurrent viewers and bitrate, plus persistent PostgreSQL/media storage.
- CDN or equivalent media delivery strategy if audience and bandwidth justify it.
- TLS, strong secrets, backups, monitoring, log retention, incident/recovery procedures.
- Android signing credentials and a release pipeline before public production distribution.

## Priority backlog

### P0 — Complete the audit and prove existing foundations
- [ ] Enumerate all frontend routes/components and backend handlers/services/repositories/models.
- [ ] Map every API endpoint to a frontend/Android consumer and a test.
- [ ] Review M3U/XMLTV parsing, source validation, timezones, duplicate handling, and import cancellation.
- [ ] Review stream selection, retry, fallback, HLS authentication, and browser compatibility.
- [ ] Review database migrations, seed behavior, backup/restore, and production defaults.
- [ ] Run full CI and resolve skipped/flaky tests; make Android lint blocking after issues are understood.
- [ ] Build and install the debug APK on a physical Android device; verify real playback with an authorized test source.

### P1 — Live TV product
- [ ] Discovery-led home page and live channel rows.
- [ ] Country, language, category, and content filters.
- [ ] Channel detail/player with tested multi-source failover and clear error states.
- [ ] EPG association and current/next program display.
- [ ] Admin source health checks, priority management, and source diagnostics.

### P2 — Sports
- [ ] Sports domain model and provider adapter.
- [ ] Competitions, teams, fixtures, event status, scores, timezone handling.
- [ ] Sports home and match detail pages.
- [ ] Optional lawful stream mapping; never scrape or redistribute unauthorized feeds.

### P3 — VOD/series
- [ ] End-to-end upload/import/transcode/playback validation.
- [ ] Rich catalog and detail pages, seasons/episodes, watch progress.
- [ ] Metadata/poster provenance and fallback behavior.

### P4 — Arabic-first experience and platform parity
- [ ] Arabic translations and RTL design system.
- [ ] Locale-aware dates/numbers and player/admin controls.
- [ ] Android phone and Android TV UX parity.

### P5 — Production readiness
- [ ] Load, security, playback, and recovery testing.
- [ ] Production secrets, TLS, backup/restore, observability, CDN strategy.
- [ ] Signed Android release and staged rollout.

## Current conclusion

**Reuse the existing platform; do not rewrite it.** The repository already contains useful IPTV/VOD foundations, but the first milestone should be a verified live-channel experience, not an immediate production launch. Sports, Arabic/RTL, discovery UX, and production content/provider integrations are the main identified gaps.

A feature is considered complete only when its implementation, API integration, tests, and real user workflow are verified. README claims and a green build alone are not sufficient.
