/**
 * localStorageClient.js
 * ----------------------------------------------------------------------------
 * TEMPORARY DATA LAYER (MVP / no-backend phase)
 * ----------------------------------------------------------------------------
 * This file simulates a REST API client using the browser's localStorage.
 * All data for the app lives under ONE root key (see STORAGE_ROOT_KEY) as a
 * single JSON object, keyed by "collection" name (patients, doctors, etc.)
 *
 * WHY ONE FILE / ONE ROOT KEY?
 * When you're ready to connect the real backend, you only need to:
 *   1. Delete/ignore this file (or keep it for local demos/tests).
 *   2. Create `src/services/api/apiClient.js` with the same method shape
 *      (getAll, getById, create, update, remove) but backed by `fetch`.
 *   3. In every `src/services/<feature>/<feature>Service.js` file, swap the
 *      import from `localStorageClient` to `apiClient`. Nothing else in the
 *      app (pages/components) needs to change because they only ever talk
 *      to the *Service files, never to storage directly.
 *
 * Every method here is `async` on purpose (even though localStorage is
 * synchronous) so the calling code already "feels" like real API calls and
 * requires zero changes when you switch to fetch() later.
 * ----------------------------------------------------------------------------
 */

const STORAGE_ROOT_KEY = "glt_healthcare_db";
const ARTIFICIAL_DELAY_MS = 250; // simulates network latency, remove if you like

function delay(ms = ARTIFICIAL_DELAY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readDb() {
  try {
    const raw = localStorage.getItem(STORAGE_ROOT_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.error("localStorageClient: failed to read DB", err);
    return {};
  }
}

function writeDb(db) {
  try {
    localStorage.setItem(STORAGE_ROOT_KEY, JSON.stringify(db));
  } catch (err) {
    console.error("localStorageClient: failed to write DB", err);
  }
}

function ensureCollection(db, collection) {
  if (!Array.isArray(db[collection])) {
    db[collection] = [];
  }
  return db[collection];
}

function generateId(prefix = "ID") {
  const random = Math.floor(Math.random() * 900 + 100); // 3 digit
  const timePart = Date.now().toString().slice(-6);
  return `${prefix}-${timePart}${random}`;
}

/**
 * Seed a collection ONLY if it doesn't exist yet. Useful for demo data.
 */
function seedIfEmpty(collection, seedData) {
  const db = readDb();
  if (!Array.isArray(db[collection]) || db[collection].length === 0) {
    db[collection] = seedData;
    writeDb(db);
  }
}

/**
 * Generic CRUD helpers — every *Service.js file wraps these with a specific
 * collection name and (optionally) an ID prefix for nicer looking IDs.
 */
const localStorageClient = {
  async getAll(collection) {
    await delay();
    const db = readDb();
    return [...ensureCollection(db, collection)];
  },

  async getById(collection, id) {
    await delay();
    const db = readDb();
    const list = ensureCollection(db, collection);
    const item = list.find((entry) => entry.id === id);
    return item ? { ...item } : null;
  },

  async create(collection, payload, { idPrefix = "ID" } = {}) {
    await delay();
    const db = readDb();
    const list = ensureCollection(db, collection);
    const newItem = {
      id: generateId(idPrefix),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...payload,
    };
    list.push(newItem);
    writeDb(db);
    return { ...newItem };
  },

  async update(collection, id, payload) {
    await delay();
    const db = readDb();
    const list = ensureCollection(db, collection);
    const index = list.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error(`${collection} record not found: ${id}`);
    list[index] = {
      ...list[index],
      ...payload,
      updatedAt: new Date().toISOString(),
    };
    writeDb(db);
    return { ...list[index] };
  },

  async remove(collection, id) {
    await delay();
    const db = readDb();
    const list = ensureCollection(db, collection);
    const filtered = list.filter((entry) => entry.id !== id);
    db[collection] = filtered;
    writeDb(db);
    return true;
  },

  seedIfEmpty,
};

export default localStorageClient;
