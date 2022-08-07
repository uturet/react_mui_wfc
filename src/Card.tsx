import React from 'react';
import {
  Card as MUICard,
  CardContent,
  Grid,
} from '@mui/material';
import {useCard} from './CardContext';


const Filler = () => <div style={{width: '100%', height: '100px', backgroundColor: 'orange'}}/>;

const Card = () => {
  const [rows, cols, width] = useCard();
  const row = new Array(cols*rows).fill((
    <Grid item xs={12/cols}>
      <Filler/>
    </Grid>
  ));

  return (
    <Grid item xs={width}>
      <MUICard sx={{margin: 'auto'}}>
        <CardContent>
          <Grid
            container
            spacing={2}
            direction="row"
            justifyContent="center"
            alignItems="center">
            {row}
          </Grid>
        </CardContent>
      </MUICard>
    </Grid>
  );
};

export default Card;
