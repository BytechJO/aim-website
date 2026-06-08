const { app, BrowserWindow, session } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1380,
    height: 860,
    minWidth: 1100,
    minHeight: 680,
    backgroundColor: '#08080A',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Patch CORS headers so fetch() to localhost:3000 works from a file:// origin
  session.defaultSession.webRequest.onHeadersReceived(
    { urls: ['http://localhost:3000/*'] },
    (details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Access-Control-Allow-Origin': ['*'],
          'Access-Control-Allow-Headers': ['Content-Type, Authorization'],
          'Access-Control-Allow-Methods': ['GET, POST, PUT, DELETE, OPTIONS'],
        },
      });
    }
  );

  win.loadFile(path.join(__dirname, 'dashboard.html'));
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
