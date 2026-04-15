import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { PaletteOptions } from '@mui/material/styles';
import type { IpcMainInvokeEvent } from 'electron';

const getPalette = async (
  _event: IpcMainInvokeEvent,
  jsonPath: string,
): Promise<Record<string, PaletteOptions>> => {
  console.log('call getPalette', jsonPath);
  let text: string;
  if (process.env.VITE_DEV_SERVER_URL) {
    text = await readFile(path.join(process.env.APP_ROOT, jsonPath), 'utf8');
  } else {
    const response = await fetch(
      `https://raw.githubusercontent.com/joyfuI/soop-gamepinball-helper/refs/heads/main${jsonPath}`,
    );
    text = await response.text();
  }
  const json = JSON.parse(text);
  console.log('palette', json);
  return json;
};

export default getPalette;
