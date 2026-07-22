# Firefox source files

This directory mirrors the Firefox source root. For example, `src/firefox/browser/components/example.txt` replaces `.geckokit/firefox/browser/components/example.txt` before patches apply.

Use this for complete file ownership. For a small edit to a large upstream file, edit the working copy under `.geckokit/firefox/`, then run `npm run export -- <path>`.
