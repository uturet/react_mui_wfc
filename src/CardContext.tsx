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
  available: boolean
  content: CardContent
}
const CardData: CardDataInterface = {
  width: 12,
  rows: 1,
  cols: 1,
  available: false,
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
  type: 'set-rows'|'preset-rows'
  payload: {
    rows: number
  }
}
interface SetColsInterface {
  type: 'set-cols'|'preset-cols'
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
interface SetAvailableInterface {
  type: 'set-available'
}
type CardDataReducerAction = SetRowsInterface|SetColsInterface|SetTypeInterface|SetWidthInterface|SetAvailableInterface
const CardDataReducer = (state: CardDataInterface, action: CardDataReducerAction): CardDataInterface => {
  switch (action.type) {
  case 'set-width':
    if (state.width === action.payload.width) return state;
    return {...state, width: action.payload.width};
  case 'preset-rows':
    if (state.rows === action.payload.rows) return state;
    return {...state, rows: action.payload.rows};
  case 'set-rows':
    if (state.content.length < action.payload.rows) {
      const newRows = new Array(action.payload.rows - state.content.length).fill(0).map((v) =>
        new Array(state.cols).fill(CardContentTypes.map((_, j) => j)),
      );
      return {...state, available: false, content: [...state.content, ...newRows]};
    }
    return {...state, available: false, content: state.content.slice(0, action.payload.rows)};
  case 'preset-cols':
    if (state.cols === action.payload.cols) return state;
    return {...state, cols: action.payload.cols};
  case 'set-cols':
    if (state.content[0].length < action.payload.cols) {
      return {
        ...state,
        available: false,
        content: state.content.map((r) => [...r, ...(new Array(action.payload.cols - state.content[0].length)
          .fill(CardContentTypes.map((_, j) => j)))]),
      };
    }
    return {
      ...state,
      available: false,
      content: state.content.map((r) => r.slice(0, action.payload.cols)),
    };
  case 'set-type':
    state.content[action.payload.row][action.payload.col] = [action.payload.type];
    return {...state, available: false};
  case 'set-available':
    return {...state, available: true};
  default:
    throw Error('Invalid Type');
  }
};

const CardContext = createContext(null);

const CardProvider = (props: any) => {
  const [cardData, cardDataDispatch] = useReducer(CardDataReducer, CardData, InitCardData);
  const setAvailable = () => cardDataDispatch({type: 'set-available'});
  const setWidth = (width: number) => cardDataDispatch({type: 'set-width', payload: {width}});
  const preSetRows = (rows: number) => cardDataDispatch({type: 'preset-rows', payload: {rows}});
  const setRows = async (rows: number) => {
    if (cardData.content.length !== rows) {
      cardDataDispatch({type: 'set-rows', payload: {rows}});
    }
  };
  const preSetCols = (cols: number) => cardDataDispatch({type: 'preset-cols', payload: {cols}});
  const setCols = async (cols: number) => {
    if (cardData.content[0].length !== cols) {
      cardDataDispatch({type: 'set-cols', payload: {cols}});
    }
  };
  const setType = (row: number, col: number, type: number) => cardDataDispatch(
    {type: 'set-type', payload: {row, col, type}});

  return <CardContext.Provider value={{cardData, setWidth, preSetRows, setRows, preSetCols, setCols, setType, setAvailable}} {...props}/>;
};

type useCardContext = {
  cardData: CardDataInterface,
  setWidth: (width: number) => void,
  preSetRows: (rows: number) => void,
  setRows: (rows: number) => void,
  preSetCols: (cols: number) => void,
  setCols: (cols: number) => void,
  setType: (row: number, col: number, type: number) => void,
  setAvailable: () => void,
}
const useCard = ():useCardContext => {
  const context = useContext(CardContext);
  if (!context) throw new Error('Not Inside the Provider');
  return context;
};

export {useCard, CardProvider, CardContentTypes};
