import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import { useState } from 'react';

import type { StoreType } from '../types';

export type PriceListProps = {
  data: StoreType['setup']['priceList'];
  onAdd: (value: StoreType['setup']['priceList'][0]) => void;
  onDelete: (value: StoreType['setup']['priceList'][0]) => void;
};

const PriceList = ({ data, onAdd, onDelete }: PriceListProps) => {
  const [value, setValue] = useState('');

  return (
    <Paper sx={{ width: 200 }}>
      <List disablePadding>
        {data.map((item) => (
          <ListItem
            key={item}
            secondaryAction={
              <IconButton edge="end" onClick={() => onDelete(item)}>
                <ClearIcon />
              </IconButton>
            }
          >
            <ListItemText primary={`별풍선 ${item}개`} />
          </ListItem>
        ))}
        <Divider />
        <ListItem
          secondaryAction={
            <IconButton edge="end" onClick={() => onAdd(parseInt(value, 10))}>
              <AddIcon />
            </IconButton>
          }
        >
          <TextField
            fullWidth
            onChange={(e) => setValue(e.target.value)}
            slotProps={{
              htmlInput: { min: 0, step: 10, inputMode: 'numeric' },
            }}
            type="number"
            value={value}
            variant="standard"
          />
        </ListItem>
      </List>
    </Paper>
  );
};

export default PriceList;
