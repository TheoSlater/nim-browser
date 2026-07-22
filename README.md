# Nim Browser

Custom Firefox browser built with GeckoKit.

Complete tutorial: `docs/customizing.md`

## Start here

```bash
npm install
npm run setup
npm run build
npm run verify
npm start
```

Use artifact mode for JS, CSS, prefs, and branding. Use full mode for Gecko, native code, WebIDL, or release packages.

## Main directories

```text
src/browser/                 Nim Browser-specific features and UI
  startup.sys.mts        small entry point; imports feature modules
  features/                  one module or folder per feature
  views/                     packaged HTML, CSS, and JS
  assets/                    icons and images
  styles/                    browser chrome and content CSS
src/firefox/                 complete files mirrored onto Firefox source paths
prefs/                       native Firefox default preferences
patches/                     small ordered edits to upstream Firefox files
branding/                    product names, icons, and platform assets
.geckokit/firefox/           generated working Firefox checkout and build tree
```

This follows Zen Browser's useful architecture: product features stay under `src/`, preferences stay separate, and upstream Firefox changes remain visible as mirrored files or patches.

## Choose the smallest customization layer

1. Appearance: edit `src/browser/styles/`.
2. Existing Firefox behavior: edit `prefs/browser.js`.
3. New UI or behavior: add a module under `src/browser/features/`, then import it from `src/browser/startup.sys.mts`.
4. Own a complete upstream file: copy it to the same path under `src/firefox/`.
5. Change a few upstream lines: export a patch into `patches/`.

Run `npm run build:fast`, then `npm start` after JS, CSS, prefs, views, overlays, or patches that only affect Firefox frontend code.

## Patch Firefox source

Use [Searchfox](https://searchfox.org/mozilla-central/source) to find a file. Its path after `mozilla-central/source/` matches the path inside `.geckokit/firefox/`.

```bash
# 1. Edit the generated working copy.
$EDITOR .geckokit/firefox/<path>

# 2. Save that Git diff as a durable project patch.
npm run export -- <path>

# 3. Reapply the ordered patch stack and rebuild.
npm run import
npm run build:fast
```

Never leave lasting work only in `.geckokit/firefox/`; `setup` can recreate it. Keep durable changes in `src/firefox/` or `patches/`. Use `npm run build` instead for C++, Rust, WebIDL, configure, or build-system changes.

## Welcome UI

The first launch shows a native notification bar from `src/browser/startup.sys.mts`.

- Edit the marked onboarding block to change it.
- Remove the block to disable it.
- Reset `geckokit.onboarding.seen` in `about:config` to show it again.

## Release

Set `build.mode` to `full` in `browser.config.json`, replace all branding assets, rerun `npm run setup`, then run `npm run package`.
