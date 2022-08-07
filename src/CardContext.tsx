import React, {createContext, useContext, useReducer} from 'react';

const CardContentTypes: string[] = [
  'Chip',
  'Divider',
  'Table',
  'Chart',
  'Text',
  'Image',
  'Image list',
  'Button',
  'Checkbox',
  'Radio button',
  'Select',
  'Slider',
  'Switch',
  'Text field',
];
// [ [top[], right[], bot[], left[]] ]
type CardContentRelations = number[][][]
const CardContentRelations: CardContentRelations = CardContentTypes.map((_, i) => [
  CardContentTypes.map((_, j) => j),
  CardContentTypes.map((_, j) => j),
  CardContentTypes.map((_, j) => j),
  CardContentTypes.map((_, j) => j),
]);

type CardContent = number[][][]
interface CardDataInterface {
  width: number
  rows: number
  cols: number
  content: CardContent
}
const CardData: CardDataInterface = {
  width: 10,
  rows: 3,
  cols: 3,
  content: [],
};

const InitCardData = (initialData: CardDataInterface): CardDataInterface => {
  const content: number[][][] = new Array(initialData.rows).fill(0).map((v) =>
    new Array(initialData.cols).fill(CardContentTypes.map((_, i) => i)),
  );
  return {...initialData, content};
};

interface SetWidthInterface {
  type: 'set-width'
  payload: {
    width: number
  }
}
interface SetRowsInterface {
  type: 'set-rows'
  payload: {
    rows: number
  }
}
interface SetColsInterface {
  type: 'set-cols'
  payload: {
    cols: number
  }
}
interface SetTypeInterface {
  type: 'set-type'
  payload: {
    col: number
    row: number
    type: number
  }
}
type CardDataReducerAction = SetRowsInterface|SetColsInterface|SetTypeInterface|SetWidthInterface
const CardDataReducer = (state: CardDataInterface, action: CardDataReducerAction): CardDataInterface => {
  switch (action.type) {
  case 'set-width':
    return {...state, width: action.payload.width};
  case 'set-rows':
    if (state.rows < action.payload.rows) {
      const newRows = new Array(action.payload.rows - state.rows).fill(0).map((v) =>
        new Array(state.cols).fill(CardContentTypes.map((_, j) => j)),
      );
      return {width: state.width, cols: state.cols, rows: action.payload.rows, content: [...state.content, ...newRows]};
    }
    return {width: state.width, cols: state.cols, rows: action.payload.rows, content: state.content.slice(0, action.payload.rows)};
  case 'set-cols':
    if (state.cols < action.payload.cols) {
      return {
        width: state.width,
        rows: state.rows,
        cols: action.payload.cols,
        content: state.content.map((r) => [...r, ...(new Array(action.payload.cols - state.cols)
          .fill(CardContentTypes.map((_, j) => j)))]),
      };
    }
    return {
      width: state.width,
      rows: state.rows,
      cols: action.payload.cols,
      content: state.content.map((r) => r.slice(0, action.payload.cols)),
    };
  case 'set-type':
    state.content[action.payload.row][action.payload.col] = [action.payload.type];
    return {...state};
  default:
    throw Error('Invalid Type');
  }
};

const CardContext = createContext(null);

const CardProvider = (props: any) => {
  const [cardData, cardDataDispatch] = useReducer(CardDataReducer, CardData, InitCardData);
  const setWidth = (width: number) => cardDataDispatch({type: 'set-width', payload: {width}});
  const setRows = (rows: number) => cardDataDispatch({type: 'set-rows', payload: {rows}});
  const setCols = (cols: number) => cardDataDispatch({type: 'set-cols', payload: {cols}});
  const setType = (row: number, col: number, type: number) => cardDataDispatch(
    {type: 'set-type', payload: {row, col, type}});

  return <CardContext.Provider value={[cardData, setWidth, setRows, setCols, setType]} {...props}/>;
};

type useCardContext = [
  CardDataInterface,
  (width: number) => void,
  (rows: number) => void,
  (cols: number) => void,
  (row: number, col: number, type: number) => void,
]
const useCard = ():useCardContext => {
  const context = useContext(CardContext);
  if (!context) throw new Error('Not Inside the Provider');
  return context;
};

export {useCard, CardProvider, CardContentTypes};
