import type { IpcRendererEvent } from 'electron';
import { contextBridge, ipcRenderer } from 'electron';
import type Store from 'electron-store';
import type { ChatResponse, DonationResponse } from 'soop-extension';

import type { DotPath, DotPathValue } from '../src/types';
import type { StoreType } from './store';

type StoreMethods = Store<StoreType>;

const electronApi = {
  getStore: ((key: string, defaultValue?: unknown) =>
    ipcRenderer.sendSync('getStore', key, defaultValue)) as StoreMethods['get'],
  getStoreAsync: <K extends DotPath<StoreType>>(
    key: K,
    defaultValue?: unknown,
  ): Promise<DotPathValue<StoreType, K>> =>
    ipcRenderer.invoke('getStoreAsync', key, defaultValue),
  setStore: ((key: string, value: unknown) =>
    ipcRenderer.send('setStore', key, value)) as StoreMethods['set'],
  appendToArrayStore: ((key: string, value: unknown) =>
    ipcRenderer.send(
      'appendToArrayStore',
      key,
      value,
    )) as StoreMethods['appendToArray'],
  deleteStore: ((key: string) =>
    ipcRenderer.send('deleteStore', key)) as StoreMethods['delete'],
  clearStore: (() => ipcRenderer.send('clearStore')) as StoreMethods['clear'],
  quit: () => ipcRenderer.send('quit'),
  playSoopChat: (streamerId: string): Promise<boolean> =>
    ipcRenderer.invoke('playSoopChat', streamerId),
  stopSoopChat: () => ipcRenderer.send('stopSoopChat'),
  onDonationResponse: (callback: (response: DonationResponse) => void) => {
    const listener = (_event: IpcRendererEvent, value: DonationResponse) =>
      callback(value);
    ipcRenderer.on('donationResponse', listener);
    return () => {
      ipcRenderer.off('donationResponse', listener);
    };
  },
  onChatResponse: (callback: (response: ChatResponse) => void) => {
    const listener = (_event: IpcRendererEvent, value: ChatResponse) =>
      callback(value);
    ipcRenderer.on('chatResponse', listener);
    return () => {
      ipcRenderer.off('chatResponse', listener);
    };
  },
  // test
  testDonation: (amount: number, comment: string) => {
    ipcRenderer.send('testDonation', amount, comment);
  },
};

contextBridge.exposeInMainWorld('electron', electronApi);

export type ElectronApi = typeof electronApi;
