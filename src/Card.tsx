import React, {useMemo, useLayoutEffect, useState} from 'react';
import {
  Card as MUICard,
  CardContent,
  Grid,
  Button,
  Paper,
} from '@mui/material';
import {useCard, CardContentTypes} from './CardContext';

interface CardCellProps {
  row: number
  col: number
  size: number
}
const CardCell: React.FunctionComponent<CardCellProps> = ({row, col, size}) => {
  const {cardData, setType} = useCard();
  const [buttons, setButtons] = useState<string[]>([]);
  useLayoutEffect(() => {
    if (cardData.content.length-1 < row || cardData.content[0].length-1 < col) return;
    setButtons(Array.from(cardData.content[row][col]).map((t) => CardContentTypes[t]));
  }, [cardData.content[row] ? cardData.content[row][col]: undefined]);

  return (
    <Grid item xs={size}>
      <Paper sx={{display: 'flex', flexDIrection: 'row', flexWrap: 'wrap', justifyContent: 'space-between'}} variant="outlined">
        {buttons.map((t, i) => {
          return <Button
            key={`${t}`}
            size='small'
            variant="text"
            onClick={() => setType(row, col, t)}>
            {t}
          </Button>;
        })}
      </Paper>
    </Grid>
  );
};


const Card = () => {
  const {cardData} = useCard();
  const content = useMemo(() => cardData.content.map((r, i) => {
    return r.map((c, j) => <CardCell
      key={`${i} ${j}`}
      row={i}
      col={j}
      size={12/cardData.content[0].length}/>);
  }), [cardData.ready, cardData.content.length, cardData.content[0].length]);

  if (!cardData.ready) return null;

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
