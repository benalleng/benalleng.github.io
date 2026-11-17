#!/usr/bin/env node
// Inlines the js/ sources into index.html so the page ships as a single response.
//
// Every js/*.js file is inlined as its own <script> block. Libraries (*.min.js)
// come first, then the rest alphabetically. All existing inline <script> blocks
// are replaced by the generated set, placed where the first one was (or before
// </body> if there are none). Run before committing:
//
//   node build.js          rewrite index.html
//   node build.js --check  exit 1 if index.html is out of date (for pre-commit hooks)

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const ROOT = __dirname;
const HTML = path.join(ROOT, "index.html");
const JS_DIR = "js";
// 10 TCP segments * 1460 bytes: the initial congestion window
const SIZE_BUDGET = 14600;

const check = process.argv.includes("--check");
const html = fs.readFileSync(HTML, "utf8");

const isLib = (f) => f.endsWith(".min.js");
const scripts = fs.readdirSync(path.join(ROOT, JS_DIR))
	.filter((f) => f.endsWith(".js"))
	.sort((a, b) => isLib(b) - isLib(a) || a.localeCompare(b));

const blocks = scripts.map((file) => {
	const src = fs.readFileSync(path.join(ROOT, JS_DIR, file), "utf8").trimEnd();
	if (src.includes("</script")) {
		console.error(`${JS_DIR}/${file} contains "</script", which would break inlining.`);
		process.exit(1);
	}
	return `\t<script>${src}</script>\n`;
}).join("");

// Inline scripts only: `<script>` with no attributes (so no src=, type=, etc.),
// each on its own line(s).
const SCRIPT_RE = /^[ \t]*<script>[\s\S]*?<\/script>[ \t]*\n/gm;
const first = html.search(SCRIPT_RE);
const stripped = html.replace(SCRIPT_RE, "");
const at = first !== -1 ? first : stripped.indexOf("</body>");
if (at === -1) {
	console.error("No inline <script> blocks or </body> found in index.html.");
	process.exit(1);
}
const built = stripped.slice(0, at) + blocks + stripped.slice(at);
console.log(`Inlining: ${scripts.join(", ")}`);

const raw = Buffer.byteLength(built);
const gz = zlib.gzipSync(built, { level: 9 }).length;
const sizeMsg = `index.html: ${raw} bytes raw, ${gz} bytes gzipped (budget ${SIZE_BUDGET})`;

if (check) {
	if (built !== html) {
		console.error("index.html is out of date with js/. Run `node build.js`.");
		process.exit(1);
	}
	console.log("index.html is up to date.");
} else if (built !== html) {
	fs.writeFileSync(HTML, built);
	console.log("index.html updated.");
} else {
	console.log("index.html already up to date.");
}

console.log(sizeMsg);
if (gz > SIZE_BUDGET) {
	console.error(`Warning: gzipped size exceeds ${SIZE_BUDGET} bytes.`);
	process.exit(check ? 1 : 0);
}
