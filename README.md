# biso24-editor

Custom CKEditor4 build (trimmed plugins) served as static assets for Biso24 modules.

## Usage (monorepo)
Add as a dependency and sync into each module's `public/js/`:

```jsonc
"dependencies": { "@biso24/editor": "github:tmnthieu/biso24-editor#v1.1.0" }
```

A sync script copies `node_modules/@biso24/editor/CKEditor4` -> `modules/*/public/js/CKEditor4`.
`CKEditorField` loads it at runtime via `editorUrl` (BASE_URL/js/CKEditor4/ckeditor.js).

Keep the whole folder together — `CKEDITOR.basePath` is derived from the `ckeditor.js` URL.
