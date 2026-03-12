/**
 * Option B: import PRODUCTS and CATEGORIES from app.js into products.json.
 * Run from project root: node server/seed-products.js
 */
const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'app.js');
const productsPath = path.join(__dirname, 'products.json');

let src = fs.readFileSync(appPath, 'utf8');

function extractArray(name) {
  const startMarker = `const ${name} = [`;
  const start = src.indexOf(startMarker);
  if (start === -1) return null;
  let pos = start + startMarker.length - 1;
  let depth = 0;
  const begin = pos;
  while (pos < src.length) {
    const ch = src[pos];
    if (ch === '[' || ch === '{') depth++;
    else if (ch === ']' || ch === '}') {
      depth--;
      if (ch === ']' && depth === 0) return src.slice(begin, pos + 1);
    }
    pos++;
  }
  return null;
}

function evalArray(jsStr) {
  if (!jsStr) return null;
  const cleaned = jsStr
    .split('\n')
    .map((line) => (line.trim().startsWith('//') ? '' : line))
    .join('\n')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/,(\s*[}\]])/g, '$1');
  try {
    return new Function('return (' + cleaned + ')')();
  } catch (e) {
    console.error('Eval error:', e.message);
    return null;
  }
}

const categoriesStr = extractArray('CATEGORIES');
const productsStr = extractArray('PRODUCTS');

const categories = evalArray(categoriesStr);
const products = evalArray(productsStr);

if (!categories || !Array.isArray(categories)) {
  console.error('Could not extract CATEGORIES');
  process.exit(1);
}
if (!products || !Array.isArray(products)) {
  console.error('Could not extract PRODUCTS');
  process.exit(1);
}

const data = { categories, products };
fs.writeFileSync(productsPath, JSON.stringify(data, null, 2), 'utf8');
console.log('Done. Imported', categories.length, 'categories and', products.length, 'products into server/products.json');
