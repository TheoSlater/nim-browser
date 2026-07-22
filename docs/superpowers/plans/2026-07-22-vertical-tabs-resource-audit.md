# Vertical Tabs and Resource Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Default new Nim Browser profiles to native vertical tabs, then identify safe size and resource reductions without destabilizing Firefox UI.

**Architecture:** Use project-owned default preferences for UI choice. Keep audit read-only and separate from implementation; recommend only measured, reversible native preferences or build exclusions whose missing runtime dependencies are understood.

**Tech Stack:** GeckoKit project prefs, Firefox preferences, Gecko build manifests, shell verification.

## Global Constraints

- Keep lasting customization outside `.geckokit/firefox/` unless exported as a patch.
- Export and import every upstream Firefox edit.
- Preserve browser startup and core browsing behavior.

---

### Task 1: Vertical-tabs default

**Files:**
- Modify: `prefs/browser.js`

**Interfaces:**
- Consumes: Firefox native `sidebar.revamp` and `sidebar.verticalTabs` preferences.
- Produces: vertical tabs on new profiles; users can still switch back.

- [ ] **Step 1: Verify the desired defaults are absent**

Run: `rg '^pref\("sidebar\.(revamp|verticalTabs)"' prefs/browser.js`
Expected: no matches.

- [ ] **Step 2: Add native defaults**

```js
pref("sidebar.revamp", true);
pref("sidebar.verticalTabs", true);
```

- [ ] **Step 3: Apply and build**

Run: `npm run import && npm run build:fast`
Expected: both commands exit 0.

- [ ] **Step 4: Verify startup**

Run: `npm run verify`
Expected: `Firefox startup verified.`

### Task 2: Resource and size audit

**Files:**
- Inspect: `prefs/browser.js`
- Inspect: `browser.config.json`
- Inspect: `.geckokit/firefox/obj-geckokit-nim-browser/dist/bin/`
- Inspect: relevant Firefox `moz.build`, package manifest, and preference call sites.

**Interfaces:**
- Consumes: current build output sizes, current preferences, Firefox dependency graph.
- Produces: prioritized recommendations labeled safe, tradeoff, or unsafe.

- [ ] **Step 1: Measure largest build outputs**

Run: `du -ah .geckokit/firefox/obj-geckokit-nim-browser/dist/bin | sort -hr | head -80`
Expected: ranked unpacked build artifacts.

- [ ] **Step 2: Inspect current resource controls**

Run: `sed -n '1,180p' prefs/browser.js`
Expected: existing telemetry, AI, prelaunch, cache, and process settings.

- [ ] **Step 3: Trace each candidate to its Firefox default or build owner**

Run targeted `rg` searches for each preference, library, or manifest entry.
Expected: evidence showing whether removal is dormant, dynamically loaded, packaged-only, or startup-critical.

- [ ] **Step 4: Report recommendations**

Rank by expected impact. Do not apply audit candidates until user selects accepted behavior tradeoffs.
