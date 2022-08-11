import React from 'react';
import {faker} from '@faker-js/faker';
import {
  Divider,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from '@mui/material';


interface GenericProps {
  size: number
}
export const ChipGeneric: React.FunctionComponent<GenericProps> = ({size}) => {
  return (
    <div>Chip</div>
  );
};
export const DividerGeneric: React.FunctionComponent<GenericProps> = ({size}) => {
  return (
    <Divider />
  );
};

function createData(
  name: string,
  calories: number,
) {
  return {name, calories};
}
export const TableGeneric: React.FunctionComponent<GenericProps> = ({size}) => {
  const rows = [
    createData('Aba', 159),
    createData('Ice', 237),
    createData('Ecl', 262),
    createData('Cup', 305),
    createData('Gin', 356),
  ];

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{'&:last-child td, &:last-child th': {border: 0}}}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
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
      {(new Array(size)).fill(0).map((v, i) => <p key={i.toString()}>{faker.lorem.paragraph()}</p>)}
    </>
  );
};
export const ImageGeneric: React.FunctionComponent<GenericProps> = ({size}) => {
  return (
    <img
      src={faker.image.image()}
      loading="lazy"
      style={{
        display: 'block',
        width: '100%',
      }}/>
  );
};
export const ImageListGeneric: React.FunctionComponent<GenericProps> = ({size}) => {
  return (
    <div>ImageList</div>
  );
};
export const ButtonGeneric: React.FunctionComponent<GenericProps> = ({size}) => {
  return (
    <div>Button</div>
  );
};
export const CheckboxGeneric: React.FunctionComponent<GenericProps> = ({size}) => {
  return (
    <div>Checkbox</div>
  );
};
export const RadioButtonGeneric: React.FunctionComponent<GenericProps> = ({size}) => {
  return (
    <div>RadioButton</div>
  );
};
export const SelectGeneric: React.FunctionComponent<GenericProps> = ({size}) => {
  return (
    <div>Select</div>
  );
};
export const SliderGeneric: React.FunctionComponent<GenericProps> = ({size}) => {
  return (
    <div>Slider</div>
  );
};
export const SwitchGeneric: React.FunctionComponent<GenericProps> = ({size}) => {
  return (
    <div>Switch</div>
  );
};
export const TextFieldGeneric: React.FunctionComponent<GenericProps> = ({size}) => {
  return (
    <div>TextField</div>
  );
};
