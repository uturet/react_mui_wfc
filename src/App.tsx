import React from 'react';
import {
  Grid,
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import Card from './Card';
import Drawer from './Drawer';
import {CardProvider} from './CardContext';
const drawerWidth = 240;

function App() {
  return (
    <CardProvider>
      <Box sx={{display: 'flex', width: '100%'}}>
        <AppBar>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              sx={{mr: 2, display: {sm: 'none'}}}
            >
            </IconButton>
            <Typography variant="h6" noWrap component="div">
            MaterialUI Wave Function Collapse
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>

      <Box>

        <Drawer>
          <div>
            <Toolbar />
            <Divider />
            <List>
              {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                <ListItem key={text} disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Divider />
            <List>
              {['All mail', 'Trash', 'Spam'].map((text, index) => (
                <ListItem key={text} disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </div>
        </Drawer>
      </Box>

      <Box sx={{
        display: 'flex',
        width: `calc(100% - ${drawerWidth}px)`,
        minHeight: 'calc(100% - 132px)',
        height: 'fit-content',
        marginLeft: 'auto',
        padding: '88px 24px 24px 24px',
      }}>
        <Grid
          container
          rowSpacing={4.5}
          columnSpacing={2.75}
          direction="row"
          justifyContent="center"
          alignItems="center">
          <Card/>
        </Grid>
      </Box>

    </CardProvider>
  );
}

export default App;
