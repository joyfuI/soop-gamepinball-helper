import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { app, BrowserWindow, ipcMain, session, shell } from 'electron';
import Store from 'electron-store';

import { handlePlaySoopChat, handleStopSoopChat } from './soop';
import type { StoreType } from './store';
import { schema } from './store';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, '..');

export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');

process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST;

const isInternalWindowOpen = (url: string) => {
  const target = new URL(url);
  if (process.env.VITE_DEV_SERVER_URL) {
    return target.origin === new URL(process.env.VITE_DEV_SERVER_URL).origin;
  }
  return target.protocol === 'file:';
};

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    webPreferences: { preload: path.join(__dirname, 'preload.mjs') },
    icon: path.join(process.env.VITE_PUBLIC, 'icon.png'),
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'));
  }

  win.webContents.setWindowOpenHandler(({ url }) => {
    console.log('open', url);
    if (isInternalWindowOpen(url)) {
      return {
        action: 'allow',
        overrideBrowserWindowOptions: {
          webPreferences: { preload: path.join(__dirname, 'preload.mjs') },
          icon: path.join(process.env.VITE_PUBLIC, 'icon.png'),
        },
      };
    }
    shell.openExternal(url);
    return { action: 'deny' };
  });

  session.defaultSession.webRequest.onBeforeSendHeaders(
    {
      urls: ['https://www.youtube.com/*', 'https://www.youtube-nocookie.com/*'],
    },
    (details, callback) => {
      details.requestHeaders.Referer =
        'https://com.joyfui.soop-gamepinball-helper';
      callback({ requestHeaders: details.requestHeaders });
    },
  );
};

app.setPath(
  'appData',
  process.env.PORTABLE_EXECUTABLE_DIR ?? process.env.APP_ROOT,
);

const store = new Store<StoreType>({ schema });

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('browser-window-created', (_event, win) => {
  // test. 개발자도구 undocked 모드로 열기
  win.webContents.on('before-input-event', (event, input) => {
    if (input.type === 'keyDown' && input.key === 'F12') {
      event.preventDefault();
      if (win.webContents.isDevToolsOpened()) {
        win.webContents.closeDevTools();
      } else {
        win.webContents.openDevTools({ mode: 'undocked' });
      }
    }
  });
});

app.whenReady().then(createWindow);

ipcMain.on('getStore', (event, key, defaultValue) => {
  event.returnValue = store.get(key, defaultValue);
});
ipcMain.handle('getStoreAsync', async (_event, key, defaultValue) =>
  store.get(key, defaultValue),
);
ipcMain.on('setStore', (_event, key, value) => store.set(key, value));
ipcMain.on('appendToArrayStore', (_event, key, value) =>
  store.appendToArray(key, value),
);
ipcMain.on('deleteStore', (_event, key) => store.delete(key));
ipcMain.on('clearStore', () => store.clear());
ipcMain.on('quit', () => app.quit());
ipcMain.handle('playSoopChat', handlePlaySoopChat);
ipcMain.on('stopSoopChat', handleStopSoopChat);
// test
ipcMain.on('testDonation', (event, windowType, amount, comment) => {
  if (windowType === 'reroll-timer') {
    event.sender.send('donationResponse', 'reroll-timer', {
      receivedTime: new Date().toISOString(),
      to: 'joyfui',
      from: 'joyfui',
      fromUsername: 'joyfuI',
      amount: amount.toString(),
      fanClubOrdinal: '0',
    });
    return;
  }
  event.sender.send('donationResponse', 'main', {
    receivedTime: new Date().toISOString(),
    to: 'joyfui',
    from: 'joyfui',
    fromUsername: 'joyfuI',
    amount: amount.toString(),
    fanClubOrdinal: '0',
  });
  setTimeout(() => {
    event.sender.send('chatResponse', 'main', {
      receivedTime: new Date().toISOString(),
      username: 'joyfuI',
      userId: 'joyfui',
      comment,
    });
  }, 0);
});
