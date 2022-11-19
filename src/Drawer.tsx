import React, {useState} from 'react';
import {
  Drawer as MUIDrawer,
  DrawerProps,
  Divider,
  List,
  ListItem,
  Slider,
  Typography,
  Box,
  Button,
} from '@mui/material';
import {useCard} from './CardContext';

interface ListItemSliderProps {
  label: string
  max: number
  val: number
  disabled: boolean
  preSetVal: (val: number) => void
  setVal?: (val: number) => void
}
const ListItemSlider: React.FunctionComponent<ListItemSliderProps> = (
  {label, max, val, disabled, preSetVal, setVal}) => {
  return (
    <>
      <ListItem>
        <Typography align='center'>
          {label} {val}
        </Typography>
      </ListItem>
      <ListItem>
        <Slider
          disabled={disabled}
          sx={{width: '95%'}}
          value={val}
          step={1}
          marks
          min={1}
          max={max}
          onChangeCommitted={(e, v) => setVal ? setVal(v as number) : null}
          onChange={(e, v) => preSetVal(v as number)} />
      </ListItem>
    </>
  );
};

const Drawer: React.FunctionComponent<DrawerProps> = (props) => {
  const {cardData, setWidth, setRows, setCols, clear, generate} = useCard();
  const [width, preSetWidth] = useState<number>(cardData.width);
  const [rows, preSetRows] = useState<number>(cardData.content.length);
  const [cols, preSetCols] = useState<number>(cardData.content[0].length);

  return (
    <Box sx={{display: 'flex'}}>
      <MUIDrawer
        sx={{
          'width': '240px',
          'flexShrink': 0,
          '& .MuiDrawer-paper': {
            width: '240px',
            boxSizing: 'border-box',
          },
        }}
        open={true}
        variant='persistent'>
        <Box sx={{display: 'flex', flexDirection: 'column', height: '100%'}}>
          <Box sx={{flexGrow: '1'}}/>
          <List>
            <ListItem>
              <Button onClick={clear} fullWidth>Clear</Button>
            </ListItem>
            <ListItem>
              <Button disabled={cardData.collapsed} onClick={generate} fullWidth>Generate</Button>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItemSlider
              disabled={false}
              label='Width'
              val={width}
              max={12}
              setVal={setWidth}
              preSetVal={preSetWidth}/>

            <ListItemSlider
              disabled={cardData.collapsed}
              label='Columns'
              val={cols}
              max={12}
              preSetVal={preSetCols}
              setVal={setCols}/>

            <ListItemSlider
              disabled={cardData.collapsed}
              label='Rows'
              val={rows}
              max={12}
              preSetVal={preSetRows}
              setVal={setRows}/>
          </List>
        </Box>
      </MUIDrawer>
    </Box>
  );
};

export default Drawer;
