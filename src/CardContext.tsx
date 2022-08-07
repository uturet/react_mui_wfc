import React, {createContext, useContext, useState} from 'react';

const CardContext = createContext(null);

const CardProvider = (props: any) => {
  const [cols, setCols] = useState<number>(3);
  const [rows, setRows] = useState<number>(3);
  const [width, setWidth] = useState<number>(3);

  return <CardContext.Provider value={[rows, cols, width, setRows, setCols, setWidth]} {...props}/>;
};

const useCard = ():[number, number, number, (rows: number) => void, (cols: number) => void, (rows: number) => void] => {
  const context = useContext(CardContext);
  if (!context) throw new Error('Not Inside the Provider');
  return context;
};

export {useCard, CardProvider};
