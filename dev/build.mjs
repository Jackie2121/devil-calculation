import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');

const [html, css, engine, app] = await Promise.all([
  readFile(path.join(here, 'index.html'), 'utf8'),
  readFile(path.join(here, 'styles.css'), 'utf8'),
  readFile(path.join(here, 'engine.js'), 'utf8'),
  readFile(path.join(here, 'app.js'), 'utf8')
]);

const styleTag = `<style>\n${css}\n</style>`;
const engineTag = `<script>\n${engine}\n</script>`;
const appTag = `<script>\n${app}\n</script>`;

const output = html
  .replace('<link rel="stylesheet" href="styles.css">', () => styleTag)
  .replace('<script src="engine.js"></script>', () => engineTag)
  .replace('<script src="app.js"></script>', () => appTag);

const target = path.join(root, '魔鬼计算.html');
await writeFile(target, output, 'utf8');
console.log(`Built ${target} (${Buffer.byteLength(output, 'utf8')} bytes)`);
