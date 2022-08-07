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

const Drawer: React.FunctionComponent<DrawerProps> = (props) => {
  const [rows, cols, width, setRows, setCols, setWidth] = useCard();

  return (
    <MUIDrawer {...props}>
      <Box sx={{display: 'flex', flexDirection: 'column', height: '100%'}}>
        <Toolbar />
        <Divider />
        <Box sx={{flexGrow: '1'}}/>
        <Divider />
        <List>
          <ListItem>
            <Typography align='center'>
            Width {width}
            </Typography>
          </ListItem>
          <ListItem>
            <Slider
              sx={{width: '95%'}}
              value={width}
              step={1}
              marks
              min={1}
              max={12}
              onChange={(e, v, a) => setWidth(v as number)} />
          </ListItem>

          <ListItem>
            <Typography align='center'>
            Columns {cols}
            </Typography>
          </ListItem>
          <ListItem>
            <Slider
              sx={{width: '95%'}}
              value={cols}
              step={1}
              marks
              min={1}
              max={12}
              onChange={(e, v, a) => setCols(v as number)} />
          </ListItem>

          <ListItem>
            <Typography align='center'>
            Rows {rows}
            </Typography>
          </ListItem>
          <ListItem>
            <Slider
              sx={{width: '95%'}}
              value={rows}
              step={1}
              marks
              min={1}
              max={10}
              onChange={(e, v, a) => setRows(v as number)} />
          </ListItem>
        </List>
      </Box>
    </MUIDrawer>
  );
};

export default Drawer;
