import React from 'react';
import {
  Drawer as MUIDrawer,
  DrawerProps,
  Toolbar,
  Divider,
  List,
  ListItem,
  Slider,
  Typography,
  Box,
} from '@mui/material';
import {useCard} from './CardContext';

interface ListItemSliderProps {
  label: string
  val: number
  preSetVal: (val: number) => void
  setVal?: (val: number) => void
}
const ListItemSlider: React.FunctionComponent<ListItemSliderProps> = ({label, val, preSetVal, setVal}) => {
  return (
    <>
      <ListItem>
        <Typography align='center'>
          {label} {val}
        </Typography>
      </ListItem>
      <ListItem>
        <Slider
          sx={{width: '95%'}}
          value={val}
          step={1}
          marks
          min={1}
          max={12}
          onChangeCommitted={(e, v) => setVal ? setVal(v as number) : null}
          onChange={(e, v) => preSetVal(v as number)} />
      </ListItem>
    </>
  );
};

const Drawer: React.FunctionComponent<DrawerProps> = (props) => {
  const {cardData, setWidth, preSetRows, setRows, preSetCols, setCols} = useCard();

  return (
    <MUIDrawer {...props}>
      <Box sx={{display: 'flex', flexDirection: 'column', height: '100%'}}>
        <Toolbar />
        <Divider />
        <Box sx={{flexGrow: '1'}}/>
        <Divider />
        <List>

          <ListItemSlider
            label='Width'
            val={cardData.width}
            preSetVal={setWidth}/>

          <ListItemSlider
            label='Columns'
            val={cardData.cols}
            preSetVal={preSetCols}
            setVal={setCols}/>

          <ListItemSlider
            label='Rows'
            val={cardData.rows}
            preSetVal={preSetRows}
            setVal={setRows}/>
        </List>
      </Box>
    </MUIDrawer>
  );
};

export default Drawer;
