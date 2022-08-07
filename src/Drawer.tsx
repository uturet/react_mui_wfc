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
  setVal: (val: number) => void
}
const ListItemSlider: React.FunctionComponent<ListItemSliderProps> = ({label, val, setVal}) => {
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
          onChange={(e, v, a) => setVal(v as number)} />
      </ListItem>
    </>
  );
};

const Drawer: React.FunctionComponent<DrawerProps> = (props) => {
  const [cardData, setWidth, setRows, setCols] = useCard();

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
            setVal={setWidth}/>

          <ListItemSlider
            label='Columns'
            val={cardData.cols}
            setVal={setCols}/>

          <ListItemSlider
            label='Rows'
            val={cardData.rows}
            setVal={setRows}/>
        </List>
      </Box>
    </MUIDrawer>
  );
};

export default Drawer;
