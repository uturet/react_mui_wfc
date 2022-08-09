import {
  Divider,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from '@mui/material';
import React from 'react';

export const ChipGeneric = () => {
  return (
    <div>Chip</div>
  );
};
export const DividerGeneric = () => {
  return (
    <Divider />
  );
};

function createData(
  name: string,
  calories: number,
  fat: number,
) {
  return {name, calories, fat};
}
export const TableGeneric = () => {
  const rows = [
    createData('Aba', 159, 6.0),
    createData('Ice', 237, 9.0),
    createData('Ecl', 262, 16.0),
    createData('Cup', 305, 3.7),
    createData('Gin', 356, 16.0),
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
              <TableCell align="right">{row.fat}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export const ChartGeneric = () => {
  return (
    <div>Chart</div>
  );
};
export const TextGeneric = () => {
  return (
    <div>Text</div>
  );
};
export const ImageGeneric = () => {
  return (
    <div>Image</div>
  );
};
export const ImageListGeneric = () => {
  return (
    <div>ImageList</div>
  );
};
export const ButtonGeneric = () => {
  return (
    <div>Button</div>
  );
};
export const CheckboxGeneric = () => {
  return (
    <div>Checkbox</div>
  );
};
export const RadioButtonGeneric = () => {
  return (
    <div>RadioButton</div>
  );
};
export const SelectGeneric = () => {
  return (
    <div>Select</div>
  );
};
export const SliderGeneric = () => {
  return (
    <div>Slider</div>
  );
};
export const SwitchGeneric = () => {
  return (
    <div>Switch</div>
  );
};
export const TextFieldGeneric = () => {
  return (
    <div>TextField</div>
  );
};
