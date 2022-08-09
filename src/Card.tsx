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
  ChartGeneric,
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
  [name: string]: ReactNode
} = {
  'Chip': <ChipGeneric/>,
  'Divider': <DividerGeneric/>,
  'Table': <TableGeneric/>,
  'Chart': <ChartGeneric/>,
  'Text': <TextGeneric/>,
  'Image': <ImageGeneric/>,
  'Image list': <ImageListGeneric/>,
  'Button': <ButtonGeneric/>,
  'Checkbox': <CheckboxGeneric/>,
  'Radio button': <RadioButtonGeneric/>,
  'Select': <SelectGeneric/>,
  'Slider': <SliderGeneric/>,
  'Switch': <SwitchGeneric/>,
  'Text field': <TextFieldGeneric/>,
};

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
    setButtons(Array.from(cardData.content[row][col]));
  }, [cardData.content[row] ? cardData.content[row][col]: undefined]);

  if (cardData.collapsed) {
    return (
      <Grid item xs={size}>
        {typeComponent[buttons.values().next().value]}
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
