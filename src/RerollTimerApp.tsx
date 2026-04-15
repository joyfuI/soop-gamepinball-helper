import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import useStore from './hooks/useStore';
import { paletteMap } from './theme';

const RerollTimerApp = () => {
  const [step, setStep] = useState(0); // 0: 타이머 설정, 1: 타이머 시작, 2: 타이머 정지
  const [mm, setMM] = useState(() =>
    window.electron.getStore('pinball.timer.minute'),
  );
  const [ss, setSS] = useState(() =>
    window.electron.getStore('pinball.timer.second'),
  );
  const [isReroll, setIsReroll] = useState(false);
  const timer = useRef<NodeJS.Timeout>(null);
  const [rerollPrice] = useStore('pinball.rerollPrice');
  const [id] = useStore('setup.id');

  const palette = useMemo(() => paletteMap[id], [id]);
  const theme = useMemo(() => createTheme({ palette }), [palette]);

  const interval = useCallback(() => {
    setSS((prevSS) => {
      if (prevSS > 0) {
        return prevSS - 1;
      }
      setMM((prevMM) => (prevMM > 0 ? prevMM - 1 : 0));
      return 59;
    });
  }, []);

  const handleClick = useCallback(() => {
    switch (step) {
      case 0: {
        // 타이머 설정
        window.electron.playSoopChat('reroll-timer', id);
        timer.current = setInterval(interval, 1000);
        setStep(1);
        break;
      }

      case 1: // 타이머 시작
        window.electron.stopSoopChat('reroll-timer');
        if (timer.current) {
          clearInterval(timer.current);
        }
        setStep(2);
        break;

      case 2: // 타이머 정지
        setMM(window.electron.getStore('pinball.timer.minute'));
        setSS(window.electron.getStore('pinball.timer.second'));
        setStep(0);
        break;
    }
  }, [step, id, interval]);

  useEffect(() => {
    if (step === 1 && mm === 0 && ss === 0) {
      handleClick();
    }
  }, [step, mm, ss, handleClick]);

  useEffect(
    () =>
      window.electron.onDonationResponse((key, response) => {
        if (key !== 'reroll-timer') {
          return;
        }
        console.log('donation', key, response);
        if (step === 1 && parseInt(response.amount, 10) === rerollPrice) {
          handleClick();
          setIsReroll(true);
        }
      }),
    [step, rerollPrice, handleClick],
  );

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          p: 2,
          overflow: 'hidden',
          alignContent: 'center',
        }}
      >
        <Typography gutterBottom variant="h5">
          리롤 {rerollPrice}개
        </Typography>
        <Stack direction="row" spacing={1}>
          <TextField
            disabled={step !== 0}
            fullWidth
            onChange={(e) => {
              const value = parseInt(e.target.value, 10) || 0;
              window.electron.setStore('pinball.timer.minute', value);
              setMM(value);
            }}
            slotProps={{
              htmlInput: { min: 0, max: 59, step: 1, inputMode: 'numeric' },
            }}
            sx={{ '& .MuiInputBase-input': { py: 1, fontSize: 30 } }}
            type="number"
            value={mm.toString().padStart(2, '0')}
            variant="outlined"
          />
          <Typography sx={{ alignSelf: 'center', fontSize: 30 }}>:</Typography>
          <TextField
            disabled={step !== 0}
            fullWidth
            onChange={(e) => {
              const value = parseInt(e.target.value, 10) || 0;
              window.electron.setStore('pinball.timer.second', value);
              setSS(value);
            }}
            slotProps={{
              htmlInput: { min: 0, max: 59, step: 1, inputMode: 'numeric' },
            }}
            sx={{ '& .MuiInputBase-input': { py: 1, fontSize: 30 } }}
            type="number"
            value={ss.toString().padStart(2, '0')}
            variant="outlined"
          />
          <Button
            onClick={handleClick}
            sx={{ minWidth: 80 }}
            variant="contained"
          >
            {['시작', '정지', '초기화'][step]}
          </Button>
        </Stack>

        <Backdrop
          onClick={() => setIsReroll(false)}
          open={isReroll}
          sx={{ backgroundColor: 'rgba(0, 0, 0, 0.9)', cursor: 'pointer' }}
        >
          <Typography sx={{ color: '#fff' }} variant="h3">
            리롤!!
          </Typography>
        </Backdrop>
      </Box>
    </ThemeProvider>
  );
};

export default RerollTimerApp;
