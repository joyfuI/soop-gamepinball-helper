import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useMemo } from 'react';

import FormLabel from './components/FormLabel';
import useStore from './hooks/useStore';

const Pinball = () => {
  const [review] = useStore('review');
  const [priceList] = useStore('setup.priceList');

  const value = useMemo(
    () =>
      priceList
        .reduce<string[]>(
          (prev, curr) =>
            prev.concat(
              Object.entries(review[curr.toString()] ?? {}).map(
                ([name, amount]) => `${name}*${amount}`,
              ),
            ),
          [],
        )
        .join(','),
    [review, priceList],
  );

  return (
    <Stack spacing={2}>
      <TextField
        fullWidth
        multiline
        onChange={(e) => window.electron.setStore('setup.id', e.target.value)}
        slotProps={{ input: { readOnly: true } }}
        value={value}
        variant="outlined"
      />

      <Button
        endIcon={<OpenInNewIcon />}
        href={`https://lazygyu.github.io/roulette/?names=${value}`}
        rel="noreferrer"
        size="large"
        sx={{ alignSelf: 'self-start' }}
        target="_blank"
        variant="contained"
      >
        핀볼 사이트 열기
      </Button>

      <FormLabel label="전투3">
        <iframe
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          height="315"
          referrerPolicy="strict-origin-when-cross-origin"
          src="https://www.youtube-nocookie.com/embed/tbMIHckT5No?si=S_9ykQsUl_K-sVHT"
          title="YouTube video player"
          width="560"
        ></iframe>
      </FormLabel>
    </Stack>
  );
};

export default Pinball;
