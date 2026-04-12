import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import RerollTimerApp from './RerollTimerApp';
import theme from './theme';

const rootElement = document.getElementById('root');
const windowType = new URLSearchParams(window.location.search).get('window');
if (rootElement && !rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <ThemeProvider noSsr storageManager={null} theme={theme}>
        <SnackbarProvider>
          <CssBaseline />
          {windowType === 'reroll-timer' ? <RerollTimerApp /> : <App />}
        </SnackbarProvider>
      </ThemeProvider>
    </StrictMode>,
  );
}

// test
window.test = (amount: number, comment: string) =>
  window.electron.testDonation(window.name, amount, comment);
