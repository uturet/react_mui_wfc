import React, {useEffect, useState, ReactElement} from 'react';
import {
  Card as MUICard,
  CardContent,
  Grid,
  Button,
  Paper,
} from '@mui/material';
import {useCard, CardContentTypes} from './CardContext';

const Card = () => {
  const [content, setContent] = useState<ReactElement[][]|null>(null);
  const {cardData, setType, setAvailable} = useCard();
  const size = 12/cardData.cols;

  useEffect(() => {
    if (cardData.available) return;
    const newContent = cardData.content.map((r, i) => {
      return r.map((c, j) => (
        <Grid key={`${i} ${j}`} item xs={size}>
          <Paper sx={{display: 'flex', flexDIrection: 'row', flexWrap: 'wrap', justifyContent: 'space-between'}} variant="outlined">
            {c.map((t) => {
              return <Button
                key={`${i} ${j} ${CardContentTypes[t]}`}
                size='small'
                variant="text"
                onClick={() => setType(i, j, t)}>
                {CardContentTypes[t]}
              </Button>;
            })}
          </Paper>
        </Grid>
      ));
    });
    setContent(newContent);
    setAvailable();
  }, [cardData]);

  return (
    <Grid item xs={cardData.width}>
      <MUICard elevation={16} sx={{margin: 'auto'}}>
        <CardContent>
          <Grid
            container
            spacing={2}
            direction="row"
            justifyContent="center"
            alignItems="center">
            {content}
          </Grid>
        </CardContent>
      </MUICard>
    </Grid>
  );
};

export default Card;
