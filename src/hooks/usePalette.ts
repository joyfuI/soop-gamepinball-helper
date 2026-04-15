import type { PaletteOptions } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { useEffect, useMemo, useState } from 'react';

import useStore from './useStore';

const usePalette = () => {
  const [paletteMap, setPaletteMap] = useState<Record<string, PaletteOptions>>(
    {},
  );
  const [id] = useStore('setup.id');

  useEffect(() => {
    let ignore = false;
    window.electron.getPalette('/src/shared/palette.json').then((data) => {
      if (!ignore) {
        setPaletteMap(data);
      }
    });
    return () => {
      ignore = true;
    };
  }, []);

  const palette = useMemo(() => paletteMap[id], [paletteMap, id]);

  return useMemo(() => createTheme({ palette }), [palette]);
};

export default usePalette;
