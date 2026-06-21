import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist/public');
const indexHtml = path.join(distDir, 'index.html');

const routes = [
  'admin/login',
  'admin',
  'admin/products',
  'admin/products/new',
  'admin/categories',
  'admin/reviews',
  'admin/settings',
  'shop',
  'about',
  'gallery',
  'blog',
  'contact',
  'cart',
  'wishlist',
  'inquiry',
];

for (const route of routes) {
  const dir = path.join(distDir, route);
  fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(indexHtml, path.join(dir, 'index.html'));
  console.log(`✓ Created ${route}/index.html`);
}

console.log(`\nDone — ${routes.length} routes have physical index.html files.`);
