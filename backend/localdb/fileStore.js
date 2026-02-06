const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

async function ensureDataDir() {
  try {
    await fsp.mkdir(DATA_DIR, { recursive: true });
  } catch {}
}

function collectionPath(name) {
  return path.join(DATA_DIR, `${name}.json`);
}

async function readCollection(name) {
  await ensureDataDir();
  const file = collectionPath(name);
  try {
    const raw = await fsp.readFile(file, 'utf8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    if (parsed && Array.isArray(parsed.items)) return parsed.items;
    return [];
  } catch (e) {
    if (e && (e.code === 'ENOENT' || e.code === 'ENOTDIR')) return [];
    throw e;
  }
}

async function writeCollection(name, items) {
  await ensureDataDir();
  const file = collectionPath(name);
  const temp = `${file}.tmp`;
  const data = JSON.stringify(items, null, 2);
  await fsp.writeFile(temp, data, 'utf8');
  await fsp.rename(temp, file);
}

function matchesFilter(item, filter) {
  if (!filter || Object.keys(filter).length === 0) return true;
  return Object.entries(filter).every(([key, expected]) => {
    const actual = item[key];
    if (expected && typeof expected === 'object' && !(expected instanceof Date)) {
      if (expected.$regex !== undefined) {
        const flags = expected.$options || '';
        const re = expected.$regex instanceof RegExp ? expected.$regex : new RegExp(expected.$regex, flags);
        return re.test(String(actual || ''));
      }
      // Unsupported advanced operators -> strict fail if not equal object
      return false;
    }
    return actual === expected;
  });
}

function projectFields(item, selectExpr) {
  if (!selectExpr) return { ...item };
  const clone = { ...item };
  const parts = selectExpr.split(/\s+/).filter(Boolean);
  for (const p of parts) {
    if (p.startsWith('-')) {
      const key = p.slice(1);
      delete clone[key];
    }
  }
  return clone;
}

module.exports = {
  readCollection,
  writeCollection,
  matchesFilter,
  projectFields,
};


