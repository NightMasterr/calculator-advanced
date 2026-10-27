// IndexedDB Local Storage Manager for Calculator Advanced History
const CalculatorHistory = {
  dbName: 'CalculatorAdvancedDB',
  storeName: 'history',
  db: null,

  init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = (event) => {
        console.error("IndexedDB error:", event.target.error);
        reject(event.target.error);
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('pinned', 'pinned', { unique: false });
        }
      };
    });
  },

  addEntry(expression, result, tagColor = 'mint') {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject("DB not initialized");

      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);

      const entry = {
        expression,
        result,
        tagColor,
        pinned: false,
        timestamp: Date.now()
      };

      const request = store.add(entry);
      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject(event.target.error);
    });
  },

  getAllEntries() {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject("DB not initialized");

      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        // Sort: Pinned items first, then newest timestamp
        const entries = request.result.sort((a, b) => {
          if (a.pinned !== b.pinned) return b.pinned - a.pinned;
          return b.timestamp - a.timestamp;
        });
        resolve(entries);
      };
      request.onerror = (event) => reject(event.target.error);
    });
  },

  clearHistory() {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject("DB not initialized");

      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = (event) => reject(event.target.error);
    });
  }
};