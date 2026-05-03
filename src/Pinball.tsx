import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useMemo } from 'react';

import FormLabel from './components/FormLabel';
import useStore from './hooks/useStore';
import objectToFeatures from './utils/objectToFeatures';

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
          src="https://www.youtube-nocookie.com/embed/tbMIHckT5No?playlist=tbMIHckT5No&loop=1"
          title="YouTube video player"
          width="560"
        ></iframe>
      </FormLabel>

      <FormLabel label="리롤 단가">
        <Stack direction="row" spacing={1}>
          <TextField
            defaultValue={window.electron.getStore('pinball.rerollPrice')}
            onChange={(e) =>
              window.electron.setStore(
                'pinball.rerollPrice',
                parseInt(e.target.value, 10) || 0,
              )
            }
            slotProps={{
              htmlInput: { min: 0, step: 100, inputMode: 'numeric' },
            }}
            type="number"
            variant="standard"
          />
          <Button
            endIcon={<OpenInNewIcon />}
            onClick={() =>
              window.open(
                '?window=reroll-timer',
                'reroll-timer',
                objectToFeatures({
                  width: 320,
                  height: 170,
                  autoHideMenuBar: true,
                  maximizable: false,
                  alwaysOnTop: true,
                  backgroundThrottling: false,
                }),
              )
            }
            variant="outlined"
          >
            리롤 타이머 열기
          </Button>
        </Stack>
      </FormLabel>
    </Stack>
  );
};

export default Pinball;
