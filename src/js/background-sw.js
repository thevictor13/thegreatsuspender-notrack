/* Service Worker for Manifest V3 */

// Import all the existing background scripts
importScripts(
  'gsUtils.js',
  'gsChrome.js', 
  'gsStorage.js',
  'db.js',
  'gsIndexedDb.js',
  'gsMessages.js',
  'gsSession.js',
  'gsTabQueue.js',
  'gsTabCheckManager.js',
  'gsFavicon.js',
  'gsCleanScreencaps.js',
  'gsTabSuspendManager.js',
  'gsTabDiscardManager.js',
  'gsSuspendedTab.js',
  'background.js'
);

// Service worker specific initialization
chrome.runtime.onInstalled.addListener(() => {
  console.log('The Great Suspender service worker installed');
});

chrome.runtime.onStartup.addListener(() => {
  console.log('The Great Suspender service worker started');
});

// Keep service worker alive during active operations
let keepAliveInterval;

function keepServiceWorkerAlive() {
  if (keepAliveInterval) return;
  
  keepAliveInterval = setInterval(() => {
    chrome.runtime.getPlatformInfo(() => {
      if (chrome.runtime.lastError) {
        clearInterval(keepAliveInterval);
        keepAliveInterval = null;
      }
    });
  }, 20000); // Ping every 20 seconds
}

// Clean up when service worker is about to terminate
self.addEventListener('beforeunload', () => {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
    keepAliveInterval = null;
  }
});

// Start keep alive when needed
keepServiceWorkerAlive();