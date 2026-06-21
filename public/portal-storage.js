// No-op stub. The Reports (financial-statement) page references /portal-storage.js
// as an optional "portal storage bridge", but it persists everything in its own
// IndexedDB (rps_fs_db) and doesn't actually call any API from this file. This
// stub just prevents a 404 in the console. Safe to extend later if a real
// portal<->page storage bridge is ever needed.
window.PortalStorage = window.PortalStorage || {
  available: false,
  get: async () => null,
  set: async () => false,
  remove: async () => false,
};
