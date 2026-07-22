# Project instructions

Custom Firefox browser: Nim Browser. Built with GeckoKit.

## Use the smallest customization layer

1. Appearance: `src/browser/styles/`.
2. Firefox defaults: `prefs/browser.js`.
3. Product features: one module or folder under `src/browser/features/`, imported from `src/browser/startup.sys.mts`.
4. Complete upstream file ownership: matching path under `src/firefox/`.
5. Small upstream edits: ordered patches under `patches/`.

Never keep lasting work only in `.geckokit/firefox/`; it is a generated working checkout.

## Commands

- `npm run setup`: download, bootstrap, configure, and apply Firefox.
- `npm run build:fast`: rebuild frontend JS, CSS, prefs, views, overlays, and frontend patches.
- `npm run build`: build native code, WebIDL, configure, or build-system changes.
- `npm start`: run the browser.
- `npm run verify`: launch an isolated profile and verify startup.
- `npm run export -- <path>`: export one edited Firefox file as a patch.
- `npm run import`: reapply overlays and the ordered patch stack.

## Firefox patch workflow

1. Find the upstream path with Searchfox.
2. Edit `.geckokit/firefox/<path>`.
3. Run `npm run export -- <path>`.
4. Run `npm run import`.
5. Run `npm run build:fast`, or `npm run build` for native/build-system changes.

Firefox privileged globals such as `Services`, `ChromeUtils`, and `Components` are available to browser modules. Keep feature modules small and validate changes with `npm run verify`.
