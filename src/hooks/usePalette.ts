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
    window.electron
      .getPalette('/src/shared/palette.json')
      .then((data) => setPaletteMap(data));
  }, []);

  const palette = useMemo(() => paletteMap[id], [paletteMap, id]);
  const theme = useMemo(() => createTheme({ palette }), [palette]);

  return theme;
};

export default usePalette;
