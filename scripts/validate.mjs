import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const docs = path.join(root, "docs");
const failures = [];

const walk = async (directory) => {
  const entries = await readdir(directory);
  const files = [];
  for (const entry of entries) {
    const target = path.join(directory, entry);
    const info = await stat(target);
    if (info.isDirectory()) files.push(...(await walk(target)));
    else files.push(target);
  }
  return files;
};

const relative = (file) => path.relative(root, file).split(path.sep).join("/");
const routeFor = (file) => {
  const local = path.relative(docs, file).split(path.sep).join("/");
  if (local === "index.md") return "/";
  if (local.endsWith("/index.md")) return `/${local.slice(0, -8)}`;
  if (local.endsWith(".md")) return `/${local.slice(0, -3)}/`;
  if (local === "404.html") return "/404.html";
  return null;
};

const files = await walk(docs);
const markdownFiles = files.filter((file) => file.endsWith(".md"));
const routes = new Set(markdownFiles.map(routeFor).filter(Boolean));
routes.add("/404.html");

for (const file of markdownFiles) {
  const body = await readFile(file, "utf8");
  const name = relative(file);
  if (!body.startsWith("---\n")) failures.push(`${name}: missing YAML front matter`);
  if (/[ \t]+$/m.test(body)) failures.push(`${name}: contains trailing whitespace`);

  const redirect = /^redirect_to:\s*(\S+)/m.exec(body);
  if (redirect) {
    if (!routes.has(redirect[1])) failures.push(`${name}: redirect target ${redirect[1]} does not exist`);
    continue;
  }

  if (file.endsWith("index.md") || !name.includes("methods/did-vld-")) {
    if (!/^title:\s*.+/m.test(body)) failures.push(`${name}: missing title`);
    if (!/^description:\s*.+/m.test(body)) failures.push(`${name}: missing description`);
    if (!/^source_path:\s*.+/m.test(body)) failures.push(`${name}: missing source_path`);
  }

  const source = /^source_path:\s*(\S+)/m.exec(body);
  if (source) {
    const expected = path.join(root, source[1]);
    try {
      await stat(expected);
    } catch {
      failures.push(`${name}: source_path ${source[1]} does not exist`);
    }
  }

  for (const match of body.matchAll(/\{\{\s*['"]([^'"]+)['"]\s*\|\s*relative_url\s*\}\}/g)) {
    const target = match[1];
    if (target.startsWith("/assets/")) continue;
    if (!routes.has(target)) failures.push(`${name}: internal route ${target} does not exist`);
  }
}

const navigation = await readFile(path.join(docs, "_data", "navigation.yml"), "utf8");
for (const match of navigation.matchAll(/^\s+url:\s*(\/\S*)\s*$/gm)) {
  if (!routes.has(match[1])) failures.push(`docs/_data/navigation.yml: route ${match[1]} does not exist`);
}

const manifest = await readFile(path.join(docs, "manifest.webmanifest"), "utf8");
try {
  JSON.parse(manifest);
} catch (error) {
  failures.push(`docs/manifest.webmanifest: invalid JSON (${error.message})`);
}

const required = [
  "docs/_layouts/default.html",
  "docs/_data/navigation.yml",
  "docs/assets/css/site.css",
  "docs/assets/js/site.js",
  "docs/search.json",
  "docs/sitemap.xml",
  "docs/llms.txt",
  "README.md",
  "CONTRIBUTING.md"
];
for (const name of required) {
  try {
    await stat(path.join(root, name));
  } catch {
    failures.push(`${name}: required file is missing`);
  }
}

if (failures.length) {
  console.error(`Validation failed with ${failures.length} issue(s):\n`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Validated ${markdownFiles.length} Markdown pages, ${routes.size} routes, navigation, metadata, and required assets.`);
