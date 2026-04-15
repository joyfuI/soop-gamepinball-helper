import type { PaletteOptions } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily:
      '"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif',
  },
  components: { MuiStack: { defaultProps: { useFlexGap: true } } },
});

export const paletteMap: Record<string, PaletteOptions> = {
  dlsn9911: { primary: { main: '#6f1616' } },
  '9mogu9': { primary: { main: '#fddfc0' } },
  haroha: { primary: { main: '#d4d6d3' } },
  kgoyangyeeee: { primary: { main: '#f3e3dc' } },
  wjdfogur98: { primary: { main: '#277ee8' } },
  toocat030: { primary: { main: '#434666' } },
};

export default theme;
