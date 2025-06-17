const DB_NAME = "scan-and-compare-db";
const DB_VERSION = 1;

const STORES = {
  PRODUCTS: "products",
  ALTERNATIVES: "alternatives",
  SCAN_HISTORY: "scan-history",
};

class Database {
  constructor() {
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Produkte Store
        if (!db.objectStoreNames.contains(STORES.PRODUCTS)) {
          const productsStore = db.createObjectStore(STORES.PRODUCTS, {
            keyPath: "code",
          });
          productsStore.createIndex("name", "product_name", { unique: false });
          productsStore.createIndex("category", "categories_tags", {
            unique: false,
          });
        }

        // Alternativen Store
        if (!db.objectStoreNames.contains(STORES.ALTERNATIVES)) {
          const alternativesStore = db.createObjectStore(STORES.ALTERNATIVES, {
            keyPath: "code",
          });
          alternativesStore.createIndex("category", "categories_tags", {
            unique: false,
          });
        }

        // Scan-Historie Store
        if (!db.objectStoreNames.contains(STORES.SCAN_HISTORY)) {
          const historyStore = db.createObjectStore(STORES.SCAN_HISTORY, {
            keyPath: "id",
            autoIncrement: true,
          });
          historyStore.createIndex("timestamp", "timestamp", { unique: false });
          historyStore.createIndex("barcode", "barcode", { unique: false });
        }
      };
    });
  }

  async addProduct(product) {
    return this.add(STORES.PRODUCTS, product);
  }

  async getProduct(barcode) {
    return this.get(STORES.PRODUCTS, barcode);
  }

  async addAlternative(alternative) {
    return this.add(STORES.ALTERNATIVES, alternative);
  }

  async getAlternatives(category) {
    return this.getAllByIndex(STORES.ALTERNATIVES, "category", category);
  }

  async addToHistory(scan) {
    return this.add(STORES.SCAN_HISTORY, {
      ...scan,
      timestamp: new Date().toISOString(),
    });
  }

  async getHistory() {
    return this.getAll(STORES.SCAN_HISTORY);
  }

  // Generic CRUD operations
  async add(storeName, item) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.add(item);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async get(storeName, key) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAll(storeName) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllByIndex(storeName, indexName, value) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(value);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName, key) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

// Singleton-Instanz
const db = new Database();

export default db;
