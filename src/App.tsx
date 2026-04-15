import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import { useEffect, useMemo, useRef } from 'react';
import type { DonationResponse } from 'soop-extension';

import LinkDial from './components/LinkDial';
import Navigation from './components/Navigation';
import donationCalc from './helper/donationCalc';
import useStore from './hooks/useStore';
import Pinball from './Pinball';
import Progress from './Progress';
import Review from './Review';
import Setup from './Setup';
import { paletteMap } from './theme';

const App = () => {
  const pendingDonation = useRef(
    new Map<string, (DonationResponse & { timer: NodeJS.Timeout })[]>(),
  );
  const [tab, setTab] = useStore('tab');
  const [, setReview] = useStore('review');
  const [id] = useStore('setup.id');
  const { enqueueSnackbar } = useSnackbar();

  const palette = useMemo(() => paletteMap[id], [id]);
  const theme = useMemo(() => createTheme({ palette }), [palette]);

  // 도네이션 응답과 도네이션 전자녀(일반 텍스트) 응답이 따로 오기 때문에
  // 도네이션 응답을 받으면 일반 텍스트 응답을 기다렸다가 합친다.
  useEffect(
    () =>
      window.electron.onDonationResponse((key, response) => {
        if (key !== 'main') {
          return;
        }
        console.log('donation', key, response);
        const username = response.fromUsername;
        if (!pendingDonation.current.has(username)) {
          pendingDonation.current.set(username, []);
        }
        const queue = pendingDonation.current.get(username) ?? [];
        const timer = setTimeout(() => {
          queue.shift();
          if (queue.length === 0) {
            pendingDonation.current.delete(username);
          }
        }, 30000); // 메시지 시간 제한
        queue.push({ ...response, timer });
      }),
    [],
  );
  useEffect(
    () =>
      window.electron.onChatResponse((key, response) => {
        if (key !== 'main') {
          return;
        }
        console.log('chat', key, response);
        const username = response.username;
        const queue = pendingDonation.current.get(username) ?? [];
        if (queue.length > 0) {
          const donation = queue.shift();
          if (donation) {
            clearTimeout(donation.timer);
            const data = {
              receivedTime: donation.receivedTime,
              amount: parseInt(donation.amount, 10),
              username,
              userId: response.userId,
              message: response.comment,
            };
            const calcResult = donationCalc(data); // 단가 계산
            if (calcResult) {
              window.electron.appendToArrayStore('progress.donationList', data);
              window.dispatchEvent(
                new CustomEvent('store', {
                  detail: { key: 'progress.donationList' },
                }),
              );
              setReview((oldReview) => ({
                ...oldReview,
                [calcResult.price]: {
                  ...oldReview[calcResult.price],
                  [calcResult.name]:
                    (oldReview[calcResult.price]?.[calcResult.name] ?? 0) +
                    calcResult.amount,
                },
              }));
              enqueueSnackbar(
                `${calcResult.name} ${calcResult.amount}개 추가됨`,
              );
            }
          }
          if (queue.length === 0) {
            pendingDonation.current.delete(username);
          }
        }
      }),
    [setReview, enqueueSnackbar],
  );

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" sx={{ p: 2 }}>
        <Navigation onChange={(_e, newValue) => setTab(newValue)} value={tab}>
          <Setup />
          <Progress />
          <Review />
          <Pinball />
        </Navigation>
        <LinkDial />
      </Container>
    </ThemeProvider>
  );
};

export default App;
