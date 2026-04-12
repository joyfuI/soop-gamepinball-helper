import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import { useState } from 'react';

import type { StoreType } from '../types';

export type PinballListProps = {
  price: keyof StoreType['review'];
  data: StoreType['review'][''];
  onAdd: (
    price: keyof StoreType['review'],
    value: keyof StoreType['review'][''],
  ) => void;
  onDelete: (
    price: keyof StoreType['review'],
    value: keyof StoreType['review'][''],
  ) => void;
  onPlus: (
    price: keyof StoreType['review'],
    value: keyof StoreType['review'][''],
  ) => void;
  onMinus: (
    price: keyof StoreType['review'],
    value: keyof StoreType['review'][''],
  ) => void;
};

const PinballList = ({
  price,
  data,
  onAdd,
  onDelete,
  onPlus,
  onMinus,
}: PinballListProps) => {
  const [value, setValue] = useState('');

  return (
    <Paper sx={{ minWidth: 340 }}>
      <List
        disablePadding
        subheader={<ListSubheader>{`단가 ${price}개`}</ListSubheader>}
      >
        {Object.entries(data).map(([name, amount]) => (
          <ListItem key={name}>
            <ListItemText primary={`${name}*${amount}`} />
            <ButtonGroup size="small">
              <Button onClick={() => onPlus(price, name)}>
                <AddIcon />
              </Button>
              <Button onClick={() => onMinus(price, name)}>
                <RemoveIcon />
              </Button>
              <Button onClick={() => onDelete(price, name)}>
                <DeleteIcon />
              </Button>
            </ButtonGroup>
          </ListItem>
        ))}
        <Divider />
        <ListItem
          secondaryAction={
            <IconButton edge="end" onClick={() => onAdd(price, value)}>
              <AddIcon />
            </IconButton>
          }
        >
          <TextField
            fullWidth
            onChange={(e) => setValue(e.target.value)}
            value={value}
            variant="standard"
          />
        </ListItem>
      </List>
    </Paper>
  );
};

export default PinballList;
