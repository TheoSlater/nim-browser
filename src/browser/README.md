# Browser app code

- `startup.sys.mts`: privileged code run after the first browser window is ready
- `features/`: one module or folder per product feature
- `views/`: packaged HTML, CSS, and JavaScript
- `assets/`: packaged icons and images
- `styles/browser.css`: tabs, toolbars, menus, and other browser chrome
- `styles/content.css`: web content and built-in pages

Edit or remove the marked onboarding block in `startup.sys.mts`. Run `npm run build:fast`, then `npm start` after code changes. CSS is also copied into the development profile on each start.
