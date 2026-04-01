# astro-build-timestamp

**Writes a single build timestamp file for Astro sites**

`astro-build-timestamp` is a tiny Astro integration that writes the exact
time a site was built into a static file during `astro build`.

It solves one very specific problem:

> *When was this site last built?*

No runtime logic.  
No environment guessing.  
No metadata bloat.

---

## What this plugin does

On every build, the plugin writes a file like:

```
/build-timestamp.txt
```

Containing a single timestamp, for example:

```
2026-01-08T21:14:03.221Z
```

This file is:

- Static
- Cache-safe
- Public-safe
- Deterministic per build
- Easy to check with `curl`

---

## What it does NOT do

This plugin intentionally does **not**:

- Track deploys
- Track git commits
- Read CI metadata
- Inject HTML
- Modify routes
- Run at runtime

It answers **one question only**: *when was this build produced?*

---

## Installation

```bash
npm install astro-build-timestamp
```

---

## Basic usage

Add the integration to your `astro.config.mjs`:

```js
import { defineConfig } from "astro/config";
import astroBuildTimestamp from "astro-build-timestamp";

export default defineConfig({
  integrations: [
    astroBuildTimestamp()
  ]
});
```

After build:

```
dist/build-timestamp.txt
```

---

## Custom filename

You may change the output filename:

```js
astroBuildTimestamp({
  filename: "built-at.txt"
})
```

Result:

```
/built-at.txt
```

---

## Timestamp formats

By default, the timestamp is written in ISO 8601 format.

Supported formats:

| Format | Example |
|------|--------|
| `iso` (default) | `2026-01-08T21:14:03.221Z` |
| `unix` | `1736366043` |
| `short` | `k0x9f2ab` |

Example:

```js
astroBuildTimestamp({
  format: "unix"
})
```

---

## CDN & caching

Because the output is static:

- It works behind any CDN
- It works on Cloudflare, Netlify, Vercel, S3, etc.
- It can be cached aggressively

Check with:

```bash
curl https://example.com/build-timestamp.txt
```

---

## Failure behaviour

If the file cannot be written:

- A warning is logged
- The build continues
- Your site is not broken

This plugin must never block a deployment.

---

## License

MIT

---

## Author

Built and maintained by **Velohost UK Limited**  
https://velohost.co.uk/

Project homepage:  
https://velohost.co.uk/plugins/astro-build-timestamp/
