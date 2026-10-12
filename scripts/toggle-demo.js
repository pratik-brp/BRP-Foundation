import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const indexFilePath = path.resolve(__dirname, '../src/routes/index.tsx');
const rootFilePath = path.resolve(__dirname, '../src/routes/__root.tsx');

const action = process.argv[2] || 'unhide';

let indexCode = fs.readFileSync(indexFilePath, 'utf8');
let rootCode = fs.readFileSync(rootFilePath, 'utf8');

const isCRLF = indexCode.includes('\r\n');
const nl = isCRLF ? '\r\n' : '\n';

const START_MARKER = '{/* DEMO_HIDE_START */}';
const END_MARKER = '{/* DEMO_HIDE_END */}';

const startIndex = indexCode.indexOf(START_MARKER);
const endIndex = indexCode.indexOf(END_MARKER);

if (startIndex !== -1 && endIndex !== -1) {
  const beforeStart = indexCode.slice(0, startIndex + START_MARKER.length);
  const between = indexCode.slice(startIndex + START_MARKER.length, endIndex);
  const afterEnd = indexCode.slice(endIndex);

  // Cleanly strip any existing comment wrappers inside between
  const cleanBetween = between
    .replace(/^(\s*\{\/\*\s*)+/g, `${nl}      `)
    .replace(/(\s*\*\/}\s*)+$/g, `${nl}      `);

  if (action === 'unhide') {
    // Show footer and lower sections
    indexCode = beforeStart + cleanBetween + afterEnd;
    indexCode = indexCode.replace(/<SiteLayout[^>]*>/, '<SiteLayout>');

    // Disable 404 lock for other routes
    rootCode = rootCode.replace(/export const DEMO_404_LOCK = (true|false);/, 'export const DEMO_404_LOCK = false;');

    fs.writeFileSync(indexFilePath, indexCode, 'utf8');
    fs.writeFileSync(rootFilePath, rootCode, 'utf8');
    console.log('\x1b[32m%s\x1b[0m', '✅ All sections, navbar, and other pages are now UNHIDDEN!');
  } else if (action === 'hide') {
    // Hide footer, keep Hero, Key Initiatives & Who We Are visible, hide lower sections
    indexCode = indexCode.replace(/<SiteLayout[^>]*>/, '<SiteLayout hideFooter={true}>');
    indexCode = beforeStart + `${nl}      {/*` + cleanBetween.trimEnd() + `${nl}      */}${nl}      ` + afterEnd;

    // Enable 404 lock for all other routes
    rootCode = rootCode.replace(/export const DEMO_404_LOCK = (true|false);/, 'export const DEMO_404_LOCK = true;');

    fs.writeFileSync(indexFilePath, indexCode, 'utf8');
    fs.writeFileSync(rootFilePath, rootCode, 'utf8');
    console.log('\x1b[33m%s\x1b[0m', '🔒 Locked down! Navbar, Hero, Key Initiatives & Who We Are visible on home. All other pages show 404 Error.');
  }
} else {
  console.error('Error: DEMO_HIDE markers not found in index.tsx');
  process.exit(1);
}
