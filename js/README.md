# js

Every `.js` file in this directory is inlined directly into `index.html` by
`build.js`, so the whole page is delivered in a single response. Keep the
gzipped page under ~14.6KB, the TCP initial congestion window
(10 segments × 1460 bytes), so it arrives in the first round trip.

## Building

Run from the repo root before committing:

```sh
node build.js          # rewrite index.html from js/
node build.js --check  # exit 1 if index.html is out of date or over budget
```

Optional pre-commit hook:

```sh
printf '#!/bin/sh\nnode build.js --check\n' > .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit
```

## How it works

- Every `js/*.js` file becomes its own `<script>` block. Adding or deleting a
  file here adds or removes its block on the next build.
- Order: libraries (`*.min.js`, e.g. `umbrella.min.js`) first, then the rest
  alphabetically. Use numeric prefixes (`10-foo.js`, `20-bar.js`) if load order
  matters.
- All bare `<script>` tags in `index.html` are replaced by the generated set,
  placed where the first one was (or before `</body>` if there are none).
  Don't hand-write inline scripts in `index.html`; edit the files here instead.
  Tags with attributes (`<script src=...>`, `<script type=...>`) are left alone.
- Trailing whitespace at the end of each file is trimmed.
- A file containing `</script` is rejected, since it would break the page.
- The build prints the raw and gzipped page size and warns above 14600 bytes
  gzipped (`--check` fails instead).
