import React, {useState, useEffect} from 'react';
import {faker} from '@faker-js/faker';
import {
  Divider,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Chip,
  ImageList,
  ImageListItem,
  Button,
  Checkbox,
  FormGroup,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Switch,
  TextField,
  Typography,
  Box,
  Tab,
  Tabs,
} from '@mui/material';
import {SelectChangeEvent} from '@mui/material/Select';

const capitalize = (word: string): string => {
  return word[0].toUpperCase() + word.slice(1).toLowerCase();
};

interface GenericProps {
  size: number
}

export const TitleGeneric: React.FunctionComponent<GenericProps> = ({size}) => {
  return (
    <Typography variant='h3' sx={{textTransform: 'uppercase'}}>
      {faker.lorem.words(Math.floor(Math.random()*4)+2)}
    </Typography>
  );
};

export const TabsGeneric: React.FunctionComponent<GenericProps> = ({size}) => {
  const [value, setValue] = useState(0);
  const [tabs, setTabs] = useState<string[]>([]);

  useEffect(() => {
    setTabs((new Array<string>(size+1).fill('')).map((_) => faker.word.noun()));
  }, []);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
      <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
        {tabs.map((tab, i) => <Tab key={i.toString()} label={tab}/>)}
      </Tabs>
    </Box>
  );
};

export const ChipGeneric: React.FunctionComponent<GenericProps> = ({size}) => {
  return (
    <>
      {(new Array(size*2).fill(0)).map((v, i) => <Chip key={i.toString()} label={faker.word.noun()} />)}
    </>
  );
};
export const DividerGeneric: React.FunctionComponent<GenericProps> = ({size}) => {
  return <Divider sx={{width: '100%'}} />;
};

const tableTypes: (() => string)[] = [() => faker.word.noun(), () => Math.floor(Math.random()*1000).toString()];
function createData(
  size: number,
) {
  return (new Array(size*2).fill(0)).map((v, i) => tableTypes[i%2]());
}
export const TableGeneric: React.FunctionComponent<GenericProps> = ({size}) => {
  const rows = [
    createData(size),
    createData(size),
    createData(size),
    createData(size),
    createData(size),
  ];

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row[0]}
              sx={{'&:last-child td, &:last-child th': {border: 0}}}
            >
              {row.map((v, i) => (
                <TableCell key={i.toString()} component="th" scope="row">
                  {v}
                </TableCell>
              ))}

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export const TextGeneric: React.FunctionComponent<GenericProps> = ({size}) => {
  return (
    <>
      {(new Array(size)).fill(0).map((v, i) => <Typography
        mt={2}
        key={i.toString()}>
        {faker.lorem.sentences(size*3)}
      </Typography>)}
    </>
  );
};
export const ImageGeneric: React.FunctionComponent<GenericProps> = ({size}) => {
  return (
    <img
      src={faker.image.nature()}
      loading="lazy"
      style={{
        display: 'block',
        width: '100%',
      }}/>
  );
};
export const ImageListGeneric: React.FunctionComponent<GenericProps> = ({size}) => {
  return (
    <ImageList sx={{width: '100%'}} cols={size*2}>
      {(new Array(size*4).fill(0)).map((v, i) => (
        <ImageListItem key={i.toString()}>
          <img
            src={faker.image.nature()}
            loading="lazy"
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
};
export const ButtonGeneric: React.FunctionComponent<GenericProps> = ({size}) => {
  return (
    <Button variant="contained">{faker.word.verb(10)} {faker.word.noun(10)}</Button>
  );
};
export const CheckboxGeneric: React.FunctionComponent<GenericProps> = ({size}) => {
  return (
    <FormGroup row={true}>
      {(new Array(size*2).fill(0)).map((v, i) => <FormControlLabel
        key={i.toString()}
        control={<Checkbox />}
        label={faker.word.noun()} />)}
    </FormGroup>
  );
};
export const RadioButtonGeneric: React.FunctionComponent<GenericProps> = ({size}) => {
  return (
    <FormGroup>
      <RadioGroup row>
        {(new Array(size*2).fill(0)).map((v, i) => <FormControlLabel
          key={i.toString()}
          value={i}
          control={<Radio />}
          label={faker.word.noun()} />)}
      </RadioGroup>
    </FormGroup>
  );
};
export const SelectGeneric: React.FunctionComponent<GenericProps> = ({size}) => {
  const [options, setOptions] = useState<string[]>([]);
  const [val, setVal] = useState<number>(0);

  useEffect(() => {
    setOptions((new Array(4+size).fill(0)).map((v, i) => capitalize(faker.word.noun())));
  }, []);

  const handleChange = (event: SelectChangeEvent) => {
    setVal(parseInt(event.target.value));
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="select-label">Select Value</InputLabel>
      <Select
        labelId="select-label"
        id="select"
        value={options.length === 0 ? '': val.toString()}
        label='Select Value'
        onChange={handleChange}
      >
        {options.map((v, i) => <MenuItem key={i.toString()} value={i}>{v}</MenuItem>)}
      </Select>
    </FormControl>
  );
};
export const SliderGeneric: React.FunctionComponent<GenericProps> = ({size}) => {
  const [value, setValue] = React.useState<number>(30);

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
  };

  return (
    <Slider aria-label="Volume" value={value} onChange={handleChange} />
  );
};
export const SwitchGeneric: React.FunctionComponent<GenericProps> = ({size}) => {
  return (
    <FormGroup row={true}>
      {(new Array(size*2).fill(0)).map((v, i) => <FormControlLabel
        key={i.toString()}
        control={<Switch defaultChecked={i%3==0} />}
        label={faker.word.noun()} />)}
    </FormGroup>
  );
};
export const TextFieldGeneric: React.FunctionComponent<GenericProps> = ({size}) => {
  return (
    <TextField fullWidth label='Value' variant="outlined" />
  );
};
