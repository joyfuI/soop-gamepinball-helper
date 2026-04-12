import SyncIcon from '@mui/icons-material/Sync';
import Fab from '@mui/material/Fab';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import PinballList from './components/PinballList';
import donationCalc from './helper/donationCalc';
import useStore from './hooks/useStore';
import type { StoreType } from './types';

const Review = () => {
  const [review, setReview] = useStore('review');
  const [priceList] = useStore('setup.priceList');

  const handleAdd = (key: string, value: string) => {
    const trimValue = value.trim();
    if (trimValue) {
      setReview((oldReview) => ({
        ...oldReview,
        [key]: {
          ...oldReview[key],
          [value]: (oldReview[key]?.[value] ?? 0) + 1,
        },
      }));
    }
  };

  const handleDelete = (key: string, value: string) => {
    setReview((oldReview) => {
      const { [value]: _, ...other } = oldReview[key] ?? {};
      return { ...oldReview, [key]: { ...other } };
    });
  };

  const handlePlus = (key: string, value: string) => {
    setReview((oldReview) => ({
      ...oldReview,
      [key]: { ...oldReview[key], [value]: (oldReview[key]?.[value] ?? 0) + 1 },
    }));
  };

  const handleMinus = (key: string, value: string) => {
    if (review[key]?.[value] > 1) {
      setReview((oldReview) => ({
        ...oldReview,
        [key]: {
          ...oldReview[key],
          [value]: (oldReview[key]?.[value] ?? 0) - 1,
        },
      }));
    }
  };

  const handleSync = async () => {
    const donationList = await window.electron.getStoreAsync(
      'progress.donationList',
    );
    const newReview = donationList.reduce<StoreType['review']>((prev, curr) => {
      const calcResult = donationCalc(curr); // 단가 계산
      if (calcResult) {
        prev[calcResult.price] ??= {};
        prev[calcResult.price][calcResult.name] ??= 0;
        prev[calcResult.price][calcResult.name] += calcResult.amount;
      }
      return prev;
    }, {});
    setReview(newReview);
  };

  return (
    <>
      <Stack
        direction="row"
        spacing={1}
        sx={{ mb: 2, alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Typography sx={{ minWidth: 'fit-content' }} variant="caption">
          여기서 별풍선과 별개로 핀볼을 수정할 수 있습니다.
        </Typography>
        <Fab
          color="warning"
          onClick={handleSync}
          size="small"
          sx={{ minWidth: 'fit-content' }}
          variant="extended"
        >
          <SyncIcon sx={{ mr: 1 }} />
          인식한 별풍선을 기준으로 초기화
        </Fab>
      </Stack>

      <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
        {priceList.map((price) => (
          <PinballList
            data={review[price.toString()] ?? []}
            key={price}
            onAdd={handleAdd}
            onDelete={handleDelete}
            onMinus={handleMinus}
            onPlus={handlePlus}
            price={price.toString()}
          />
        ))}
      </Stack>
    </>
  );
};

export default Review;
