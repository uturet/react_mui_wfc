import React, {createContext, useContext, useReducer} from 'react';
import {CardContentRelations, CardContentTypes} from './CardConfig';

type CardContent = Set<number>[][]
interface CardDataInterface {
  width: number
  rows: number
  cols: number
  available: boolean
  content: CardContent
}
const CardData: CardDataInterface = {
  width: 12,
  rows: 3,
  cols: 3,
  available: false,
  content: [],
};

const InitCardData = (initialData: CardDataInterface): CardDataInterface => {
  const content: Set<number>[][] = new Array(initialData.rows).fill(0).map((v) =>
    new Array(initialData.cols).fill(0).map((v) => new Set(CardContentTypes.map((_, i) => i))),
  );
  return {...initialData, content};
};

const vaweFunction = (row: number, col: number, cardData: CardDataInterface): void => {
  if (cardData.content[row][col].size === CardContentRelations.length) return;
  const nextCells = new Set<number>();
  const changedCells = new Set<number>();
  const posToIndex = (row: number, col: number): number => (cardData.cols * row) + col;
  const indexToPos = (index: number): [number, number] => [Math.floor(index / cardData.cols), index % cardData.cols];
  const dir = [[-1, 0], [0, 1], [1, 0], [0, -1]]; // [[row, col], ]
  nextCells.add(posToIndex(row, col));
  changedCells.add(posToIndex(row, col));

  while (nextCells.size > 0) {
    const cell = indexToPos(nextCells.values().next().value);
    nextCells.delete(nextCells.values().next().value);
    if (cardData.content[cell[0]][cell[1]].size === CardContentRelations.length) continue;

    dir.forEach((d, i) => {
      const r: number = cell[0] + d[0];
      const c: number = cell[1] + d[1];
      const index = posToIndex(r, c);
      if (-1 < r && r < cardData.rows && -1 < c && c < cardData.cols &&
        cardData.content[r][c].size > 1 && !changedCells.has(index)) {
        nextCells.add(index);
        changedCells.add(index);
        const available = new Set<number>();
        cardData.content[cell[0]][cell[1]].forEach((t) => {
          CardContentRelations[t][i].forEach((v) => cardData.content[r][c].has(v) ? available.add(v) : null);
        });
        cardData.content[r][c] = available;
      }
    });
  }
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
        new Array(state.cols).fill(0).map((v) => new Set(CardContentTypes.map((_, j) => j))),
      );
      const prevLastRow = state.content.length-1;
      const newState: CardDataInterface = {...state, available: false, content: [...state.content, ...newRows]};
      newState.content[prevLastRow].forEach((c, i) => vaweFunction(prevLastRow, i, newState));
      return newState;
    }
    return {...state, available: false, content: state.content.slice(0, action.payload.rows)};
  case 'preset-cols':
    if (state.cols === action.payload.cols) return state;
    return {...state, cols: action.payload.cols};
  case 'set-cols':
    if (state.content[0].length < action.payload.cols) {
      const prevCols = state.content[0].length;
      const newState: CardDataInterface = {
        ...state,
        available: false,
        content: state.content.map((r) => [...r, ...(new Array(action.payload.cols - prevCols)
          .fill(0).map((v) => new Set(CardContentTypes.map((_, j) => j))))]),
      };

      newState.content.forEach((r, i) => vaweFunction(i, prevCols-1, newState));
      return newState;
    }
    return {
      ...state,
      available: false,
      content: state.content.map((r) => r.slice(0, action.payload.cols)),
    };
  case 'set-type':
    state.content[action.payload.row][action.payload.col] = new Set<number>([action.payload.type]);
    const newState: CardDataInterface = {...state, available: false};
    vaweFunction(action.payload.row, action.payload.col, newState);
    return newState;
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
  const setType = (row: number, col: number, type: number) => {
    cardDataDispatch({type: 'set-type', payload: {row, col, type}});
  };

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
