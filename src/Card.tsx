import React, {useMemo, useLayoutEffect, useState, ReactNode} from 'react';
import {
  Card as MUICard,
  CardContent,
  Grid,
  Button,
  Paper,
} from '@mui/material';
import {useCard} from './CardContext';
import {
  ChipGeneric,
  DividerGeneric,
  TableGeneric,
  TextGeneric,
  ImageGeneric,
  ImageListGeneric,
  ButtonGeneric,
  CheckboxGeneric,
  RadioButtonGeneric,
  SelectGeneric,
  SliderGeneric,
  SwitchGeneric,
  TextFieldGeneric,
} from './Generic';


const typeComponent: {
  [name: string]: (size: number) => ReactNode
} = {
  'Chip': (size) => <ChipGeneric size={size}/>,
  'Divider': (size) => <DividerGeneric size={size}/>,
  'Table': (size) => <TableGeneric size={size}/>,
  'Text': (size) => <TextGeneric size={size}/>,
  'Image': (size) => <ImageGeneric size={size}/>,
  'Image list': (size) => <ImageListGeneric size={size}/>,
  'Button': (size) => <ButtonGeneric size={size}/>,
  'Checkbox': (size) => <CheckboxGeneric size={size}/>,
  'Radio button': (size) => <RadioButtonGeneric size={size}/>,
  'Select': (size) => <SelectGeneric size={size}/>,
  'Slider': (size) => <SliderGeneric size={size}/>,
  'Switch': (size) => <SwitchGeneric size={size}/>,
  'Text field': (size) => <TextFieldGeneric size={size}/>,
};

interface CardCellProps {
  row: number
  col: number
}
const CardCell: React.FunctionComponent<CardCellProps> = ({row, col}) => {
  const {cardData, setType} = useCard();
  const [buttons, setButtons] = useState<string[]>([]);
  const size = (12/cardData.content[0].length)*cardData.content[row][col].size;
  useLayoutEffect(() => {
    if (cardData.content.length-1 < row || cardData.content[0].length-1 < col) return;
    setButtons(Array.from(cardData.content[row][col].values));
  }, [cardData.content[row] ? cardData.content[row][col].values: undefined]);


  if (cardData.collapsed) {
    if (cardData.content[row][col].size === 0) return null;

    return (
      <Grid item xs={size}>
        <Grid
          container
          direction="row"
          justifyContent="space-around"
          alignItems="center">
          {typeComponent[buttons.values().next().value](cardData.content[row][col].size)}
        </Grid>
      </Grid>
    );
  }

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
    return r.map((c, j) => {
      if (cardData.content[i][j].size === 0) return null;
      return <CardCell
        key={`${i} ${j}`}
        row={i}
        col={j}/>;
    });
  }), [cardData.ready, cardData.content.length, cardData.content[0].length]);

  if (!cardData.ready) return null;

  return (
    <Grid item xs={cardData.width}>
      <MUICard elevation={16} sx={{margin: 'auto'}}>
        <CardContent>
          <Grid
            container
            spacing={4}
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
