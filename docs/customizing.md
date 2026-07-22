# Customizing Nim Browser

This guide covers every customization layer GeckoKit exposes. Start at the first layer that can solve your change. Lower layers rebuild faster and break less when Firefox updates.

1. CSS for appearance.
2. Preferences for existing Firefox behavior.
3. Privileged modules for new browser behavior and UI.
4. Packaged HTML/CSS/JS for custom views.
5. Branding for product identity.
6. Firefox source files and patches for everything else.

## File map

~~~text
src/browser/startup.sys.mjs       runs after first browser window is ready
src/browser/features/*.sys.mjs    optional feature modules you create
src/browser/views/**              packaged custom HTML, CSS, and JS
src/browser/assets/**             packaged icons and images
src/browser/styles/browser.css    browser chrome: tabs, toolbar, menus
src/browser/styles/content.css    web content and built-in pages
prefs/browser.js                  default Firefox preferences
branding/                         product name and visual assets
src/firefox/                      files mirrored onto Firefox source tree
patches/                          ordered Git patches
~~~

Everything under src/browser is packaged below resource://geckokit/ with the src/browser prefix removed:

~~~text
src/browser/features/banner.sys.mjs  -> resource://geckokit/features/banner.sys.mjs
src/browser/views/dashboard.html     -> resource://geckokit/views/dashboard.html
src/browser/assets/dashboard.svg     -> resource://geckokit/assets/dashboard.svg
~~~

Never edit .geckokit/firefox permanently. That checkout is generated. Put lasting work in one of the project folders above.

## Build loop

For startup modules, views, CSS, prefs, and most Firefox frontend files:

~~~bash
npm run build:fast
npm run verify
npm start
~~~

npm run verify launches the built browser with a temporary profile, confirms startup.sys.mjs finishes without throwing, then exits. Run it before committing or packaging browser-code changes.

## JavaScript or TypeScript

The create wizard asks which language to use. JavaScript projects edit startup.sys.mjs. TypeScript projects edit startup.sys.mts; GeckoKit transpiles every .mts file under src/browser/ to .mjs during apply. Use .mjs extensions in imports because that is what Firefox runs.

~~~bash
npx geckokit create my-browser --language typescript
~~~

TypeScript catches syntax during transpilation. The generated geckokit.d.ts declares Firefox privileged globals loosely; exact Firefox API types are not promised.

For C++, Rust, WebIDL, moz.build, configure, or release packages, set build.mode to full in browser.config.json, rerun npm run setup, then use:

~~~bash
npm run build
npm start
~~~

## Split startup into feature modules

Keep startup.sys.mjs readable. Create one module per feature, export a function, and import it through resource://geckokit/.

src/browser/features/dashboard.sys.mjs:

~~~js
export function openDashboard(window) {
  const tab = window.gBrowser.addTrustedTab(
    "resource://geckokit/views/dashboard/index.html",
  );
  window.gBrowser.selectedTab = tab;
}
~~~

src/browser/startup.sys.mjs:

~~~js
import { openDashboard } from "resource://geckokit/features/dashboard.sys.mjs";

export async function startup(window) {
  // Initialize each feature here.
  openDashboard(window);
}
~~~

startup(window) receives the first ready browser window. For UI that must appear in every new window, initialize the first window and keep observing the same Firefox event:

~~~js
function initializeWindow(window) {
  // Add this feature to this window.
}

export function startup(window) {
  initializeWindow(window);
  Services.obs.addObserver(
    initializeWindow,
    "browser-delayed-startup-finished",
  );
}
~~~

Global registrations such as CustomizableUI widgets only need one startup call. Window DOM, banners, and window-specific listeners need initializeWindow.

Services, ChromeUtils, Components, Cc, Ci, and Cu are Firefox privileged globals. Do not import the removed Services.sys.mjs module.

## Add a native banner

Use the window notification box. It stays attached to the browser window instead of a selected tab, so it does not flicker when new-tab state changes.

~~~js
export async function showBanner(window) {
  await window.gNotificationBox.appendNotification(
    "nim-browser-announcement",
    {
      label: "Your message here",
      image: "chrome://branding/content/icon64.png",
      priority: window.gNotificationBox.PRIORITY_INFO_MEDIUM,
    },
    [
      {
        label: "Open dashboard",
        accessKey: "O",
        callback() {
          const tab = window.gBrowser.addTrustedTab(
            "resource://geckokit/views/dashboard/index.html",
          );
          window.gBrowser.selectedTab = tab;
        },
      },
    ],
  );
}
~~~

Call showBanner(window) from startup. To show it once, guard it with a pref:

~~~js
const seenPref = "nim-browser.announcement.seen";
if (!Services.prefs.getBoolPref(seenPref, false)) {
  await showBanner(window);
  Services.prefs.setBoolPref(seenPref, true);
}
~~~

Reset the pref in about:config while testing.

## Add a custom view

Create normal web files:

~~~text
src/browser/views/dashboard/index.html
src/browser/views/dashboard/style.css
src/browser/views/dashboard/view.js
~~~

index.html:

~~~html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="Content-Security-Policy"
          content="default-src 'self'; style-src 'self'; script-src 'self'">
    <title>Dashboard</title>
    <link rel="stylesheet" href="style.css">
    <script src="view.js" defer></script>
  </head>
  <body>
    <main>
      <p class="eyebrow">Nim Browser</p>
      <h1>Dashboard</h1>
      <p id="status">Ready.</p>
      <button id="refresh" type="button">Refresh</button>
    </main>
  </body>
</html>
~~~

style.css:

~~~css
:root {
  color-scheme: light dark;
  font: message-box;
  background: Canvas;
  color: CanvasText;
}

body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
}

main {
  width: min(42rem, calc(100% - 3rem));
}

.eyebrow {
  color: #7c3aed;
  font-weight: 700;
  text-transform: uppercase;
}
~~~

view.js:

~~~js
document.querySelector("#refresh").addEventListener("click", () => {
  document.querySelector("#status").textContent = new Date().toLocaleString();
});
~~~

Open it from privileged browser code:

~~~js
const tab = window.gBrowser.addTrustedTab(
  "resource://geckokit/views/dashboard/index.html",
);
window.gBrowser.selectedTab = tab;
~~~

Treat resource://geckokit files as privileged application code. Never inject remote HTML, secrets, or unsanitized user input. Keep view scripts local and keep a restrictive Content Security Policy.

## Add a toolbar button

Use Firefox CustomizableUI so the button participates in Customize Toolbar.

~~~js
const { CustomizableUI } = ChromeUtils.importESModule(
  "moz-src:///browser/components/customizableui/CustomizableUI.sys.mjs",
);

export function registerDashboardButton() {
  CustomizableUI.createWidget({
    id: "nim-browser-dashboard-button",
    type: "button",
    label: "Open dashboard",
    tooltiptext: "Open Nim Browser dashboard",
    defaultArea: CustomizableUI.AREA_NAVBAR,
    removable: true,
    onCommand(event) {
      const window = event.view;
      const tab = window.gBrowser.addTrustedTab(
        "resource://geckokit/views/dashboard/index.html",
      );
      window.gBrowser.selectedTab = tab;
    },
  });
}
~~~

Call registerDashboardButton() from startup. Add its icon to browser.css:

~~~css
#nim-browser-dashboard-button {
  list-style-image: url("resource://geckokit/assets/dashboard.svg");
}
~~~

Put dashboard.svg in src/browser/assets/. Widget IDs must remain stable after release or users lose placement state.

## Replace the new-tab page

Create a custom view first, then set Firefox's new-tab URL during startup:

~~~js
const { AboutNewTab } = ChromeUtils.importESModule(
  "resource:///modules/AboutNewTab.sys.mjs",
);

AboutNewTab.newTabURL = "resource://geckokit/views/dashboard/index.html";
~~~

To restore Firefox new tab:

~~~js
AboutNewTab.resetNewTabURL();
~~~

For a homepage instead, add this to prefs/browser.js:

~~~js
pref("browser.startup.page", 1);
pref("browser.startup.homepage", "resource://geckokit/views/dashboard/index.html");
~~~

## Change tabs, toolbar, menus, or sidebar

Use src/browser/styles/browser.css. Find stable selectors with Browser Toolbox rather than guessing.

Enable Browser Toolbox in about:config:

~~~text
devtools.chrome.enabled = true
devtools.debugger.remote-enabled = true
~~~

Then open Tools > Browser Tools > Browser Toolbox and inspect browser chrome.

Example:

~~~css
:root {
  --nim-browser-accent: #7c3aed;
}

#nav-bar {
  min-height: 48px;
}

.tabbrowser-tab[selected] .tab-background {
  outline: 2px solid var(--nim-browser-accent);
}

#sidebar-main {
  border-inline-end: 1px solid color-mix(in srgb, currentColor 20%, transparent);
}
~~~

Firefox chrome selectors are internal API and can change between releases. Keep rules small, test after Firefox upgrades, and prefer a source override when structure—not appearance—must change.

Use src/browser/styles/content.css for built-in pages or normal websites:

~~~css
@-moz-document url("about:newtab"), url("about:home") {
  :root {
    --newtab-primary-action-background: #7c3aed !important;
  }
}

@-moz-document domain("example.com") {
  header.advertisement {
    display: none !important;
  }
}
~~~

## Change Firefox preferences

Add native defaults to prefs/browser.js:

~~~js
pref("browser.tabs.warnOnClose", false);
pref("browser.compactmode.show", true);
pref("browser.toolbars.bookmarks.visibility", "never");
~~~

These are defaults. Existing users can override them. Use Services.prefs.setBoolPref, setIntPref, or setStringPref only when product behavior truly needs a user value.

Find a pref by changing it in about:config, or search Firefox source:

~~~bash
rg 'browser.tabs.warnOnClose' .geckokit/firefox
~~~

Do not copy random preference bundles blindly. Verify each pref exists in your pinned Firefox version.

## Change product name, vendor, ID, and binary

Edit browser.config.json:

~~~json
{
  "browser": {
    "name": "Nim Browser",
    "binaryName": "nim-browser",
    "vendor": "Your Company",
    "applicationId": "com.yourcompany.nimbrowser"
  }
}
~~~

After identity changes, run npm run setup again.

## Change icons and branding

Set branding.enabled to true in browser.config.json. Replace:

~~~text
branding/configure.sh
branding/locales/en-US/brand.ftl
branding/content/
~~~

GeckoKit starts with Firefox unofficial branding so every platform-required file exists. Replace all inherited logos/icons before distributing. Then:

~~~bash
npm run setup
npm run build
~~~

Public distribution still needs Mozilla trademark review, code signing, platform packaging, and an update system.

## Change any Firefox source file

This is the GeckoKit equivalent of Zen's engine workflow:

~~~text
Zen engine/          = GeckoKit .geckokit/firefox/  (working Firefox checkout)
Zen exported source = GeckoKit patches/             (small upstream edits)
GeckoKit src/firefox/                              (permanent whole-file replacements)
~~~

Searchfox is a read-only website for finding Firefox code. Search for visible UI text, a preference name, CSS ID, or function. Open a result and copy the path shown after mozilla-central/source/. That path is identical inside .geckokit/firefox/.

For a small upstream edit:

~~~bash
# Searchfox result: browser/base/content/browser-init.js
# Edit this local working file:
$EDITOR .geckokit/firefox/browser/base/content/browser-init.js

# Save its Git diff into patches/browser__base__content__browser-init.js.patch
npm run export -- browser/base/content/browser-init.js

# Reapply all project files and patches. Safe when already applied.
npm run import
npm run build:fast
~~~

Use npm run build instead when changing C++, Rust, WebIDL, or build files. The export command needs a path relative to .geckokit/firefox, never an absolute path.

For complete file ownership instead of a small patch:

1. Find the upstream file.
2. Copy it into src/firefox/ at the same relative path.
3. Edit the project copy.
4. Build.

Example:

~~~bash
rg 'text you see in Firefox' .geckokit/firefox/browser
mkdir -p src/firefox/browser/base/content
cp .geckokit/firefox/browser/base/content/browser-init.js   src/firefox/browser/base/content/browser-init.js
~~~

Now edit src/firefox/browser/base/content/browser-init.js. GeckoKit copies it onto the source checkout before each build.

Use this for complete file ownership. Keep the copied file close to upstream and document why it differs; large copied files create upgrade conflicts.

## Add a patch

Use patches when changing a few lines in a large upstream file is clearer than owning the entire file.

GeckoKit now handles the diff export:

~~~bash
npm run export -- browser/path/to/file
npm run import
~~~

For a new file, run git add -N path/to/file inside .geckokit/firefox before exporting. Patches apply in filename order.

GeckoKit validates the full stack before applying it. If a Firefox upgrade breaks a patch, regenerate it against the new pinned source instead of forcing it.

## Add a real about: page or change Gecko

resource://geckokit views cover most product UI. A permanent about:yourpage route requires Firefox component registration and is version-sensitive. Use src/firefox plus a patch:

1. Inspect browser/components/about/ and a nearby existing about page.
2. Add your redirector/component and page files under the same Firefox paths in src/firefox/.
3. Patch the parent moz.build or components.conf registration.
4. Switch build.mode to full and run npm run setup, then npm run build.

Use the same escape hatch for C++, Rust, WebIDL, protocol handlers, actors, processes, networking, and storage. If Firefox can do it, src/firefox and patches can change it; full builds and upstream maintenance become your responsibility.

## Remove a feature

- Remove project startup behavior: delete its import/call from startup.sys.mjs.
- Remove a packaged view/module/asset: delete it under src/browser and rebuild.
- Remove CSS: delete the rule and restart.
- Remove a default pref: delete it from prefs/browser.js and rebuild. Existing user values remain until reset.
- Remove a toolbar widget for current users: call CustomizableUI.destroyWidget("widget-id").
- Remove upstream Firefox code: create a patch; source overlays cannot represent file deletion.

## Debugging

Open browser console during launch:

~~~bash
npm start -- --jsconsole
~~~

Useful checks:

~~~bash
node --check src/browser/startup.sys.mjs
find .geckokit/firefox/obj-geckokit-*/dist/bin/geckokit -maxdepth 4 -type f
rg 'your.pref.name' .geckokit-profile/prefs.js
~~~

Common failures:

- Missing resource://geckokit file: run npm run build:fast before restarting.
- Startup changed but old behavior remains: fully quit every browser process, then restart.
- Pref looks ignored: check whether profile has a user value overriding your default.
- CSS selector stopped working: inspect current browser chrome with Browser Toolbox.
- Source edit vanished: edit src/firefox or patches, never only .geckokit/firefox.
- Native/build-system change did nothing in artifact mode: switch to full mode and rerun setup.

## Upgrade discipline

After changing Firefox version:

1. Run npm run setup.
2. Resolve failed patches.
3. Compare every src/firefox override with its new upstream version.
4. Run tests and a full product smoke test.
5. Verify branding, update, signing, privacy, and security behavior before release.
