# Firefox patches

Use patches for small edits to upstream Firefox files. GeckoKit validates and applies them in filename order before each build.

```bash
# Find the path with Searchfox, then edit its local working copy.
$EDITOR .geckokit/firefox/<path>

# Export, reapply, and rebuild.
npm run export -- <path>
npm run import
npm run build:fast
```

Use `src/firefox/<path>` instead when your project should own the complete file. Use a full build for native code, WebIDL, configure, or build-system changes.
