import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import FormLabel from './components/FormLabel';
import PriceList from './components/PriceList';
import useStore from './hooks/useStore';

const Setup = () => {
  const [, setRule] = useStore('setup.rule');
  const [priceList, setPriceList] = useStore('setup.priceList');

  const handleAdd = (value: number) => {
    if (!Number.isNaN(value) && value >= 0) {
      setPriceList((oldValue) => {
        const set = new Set(oldValue);
        set.add(value);
        return Array.from(set).sort((a, b) => a - b);
      });
    }
  };

  const handleDelete = (value: number) => {
    setPriceList((oldValue) => oldValue.filter((item) => item !== value));
  };

  return (
    <Stack spacing={2}>
      <FormLabel
        description="채팅을 연결할 스트리머의 SOOP ID를 입력하세요."
        label="SOOP ID"
      >
        <TextField
          defaultValue={window.electron.getStore('setup.id')}
          onChange={(e) => window.electron.setStore('setup.id', e.target.value)}
          variant="outlined"
        />
      </FormLabel>

      <FormLabel
        description="진행 화면에 띄울 텍스트를 입력하세요."
        label="핀볼 규칙"
      >
        <TextField
          defaultValue={window.electron.getStore('setup.rule')}
          fullWidth
          maxRows={10}
          minRows={4}
          multiline
          onChange={(e) => setRule(e.target.value)}
          variant="outlined"
        />
      </FormLabel>

      <FormLabel
        description="단가를 설정하세요. 설정한 단가의 별풍선만 기록됩니다."
        label="핀볼 단가"
      >
        <PriceList data={priceList} onAdd={handleAdd} onDelete={handleDelete} />
      </FormLabel>

      <FormLabel
        description="모든 설정은 실시간으로 저장됩니다. 처음부터 하고 싶으면 초기화 버튼을 누르세요."
        label="초기화"
      >
        <Stack direction="row" spacing={1}>
          <Button
            color="warning"
            onClick={async () => {
              const fontSize =
                await window.electron.getStoreAsync('progress.fontSize');
              window.electron.deleteStore('progress');
              window.electron.setStore('progress.fontSize', fontSize);
              window.electron.deleteStore('review');
              window.location.reload();
            }}
            variant="contained"
          >
            별풍선만 초기화
          </Button>
          <Button
            color="error"
            onClick={() => {
              window.electron.clearStore();
              window.location.reload();
            }}
            variant="contained"
          >
            전체 초기화
          </Button>
        </Stack>
      </FormLabel>
    </Stack>
  );
};

export default Setup;
