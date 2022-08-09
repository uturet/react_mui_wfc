import React, {createContext, useContext, useReducer} from 'react';
import {CardContentRelations, CardContentTypes} from './CardConfig';

type CardContent = Set<number>[][]
interface CardDataInterface {
  available: boolean
  content: CardContent
}
const CardData: CardDataInterface = {
  available: false,
  content: [],
};
interface CardMetaInterface {
  width: number
  rows: number
  cols: number
}
const CardMeta: CardMetaInterface = {
  width: 12,
  rows: 3,
  cols: 3,
};

const InitCardData = (initialData: CardDataInterface): CardDataInterface => {
  const content: Set<number>[][] = new Array(CardMeta.rows).fill(0).map((v) =>
    new Array(CardMeta.cols).fill(0).map((v) => new Set(CardContentTypes.map((_, i) => i))),
  );
  return {...initialData, content};
};

const vaweFunction = (row: number, col: number, cardData: CardDataInterface): CardDataInterface => {
  if (cardData.content[row][col].size === CardContentRelations.length) return cardData;
  const nextCells = new Set<number>();
  const changedCells = new Set<number>();
  const posToIndex = (row: number, col: number): number => (cardData.content[0].length * row) + col;
  const indexToPos = (index: number): [number, number] => [Math.floor(index / cardData.content[0].length), index % cardData.content[0].length];
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
      if (-1 < r && r < cardData.content.length && -1 < c && c < cardData.content[0].length &&
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
  return cardData;
};

const vaweFunctionCollapse = (cardData: CardDataInterface): CardDataInterface => {
  return cardData;
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
interface SetAvailableInterface {
  type: 'set-available'
  payload: {
    available: boolean
  }
}
interface ClearCallsInterface {
  type: 'clear'|'collapse'
}
type CardDataReducerAction = SetRowsInterface|SetColsInterface|SetTypeInterface|
SetWidthInterface|SetAvailableInterface|ClearCallsInterface
const CardDataReducer = (state: CardDataInterface, action: CardDataReducerAction): CardDataInterface => {
  switch (action.type) {
  case 'set-rows':
    if (state.content.length < action.payload.rows) {
      const newRows = new Array(action.payload.rows - state.content.length).fill(0).map((v) =>
        new Array(state.content[0].length).fill(0).map((v) => new Set(CardContentTypes.map((_, j) => j))),
      );
      const prevLastRow = state.content.length-1;
      const newState: CardDataInterface = {...state, available: false, content: [...state.content, ...newRows]};
      newState.content[prevLastRow].forEach((c, i) => vaweFunction(prevLastRow, i, newState));
      return newState;
    }
    return {...state, available: false, content: state.content.slice(0, action.payload.rows)};
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
    return vaweFunction(action.payload.row, action.payload.col, {...state, available: false});
  case 'set-available':
    return {...state, available: action.payload.available};
  case 'clear':
    const content: Set<number>[][] = new Array(state.content.length).fill(0).map((v) =>
      new Array(state.content[0].length).fill(0).map((v) => new Set(CardContentTypes.map((_, i) => i))),
    );
    return {...state, content};
  case 'collapse':
    return vaweFunctionCollapse({...state, available: true});
  default:
    throw Error('Invalid Type');
  }
};


type CardMetaReducerAction = SetWidthInterface|SetRowsInterface|SetColsInterface
const CardMetaReducer = (state: CardMetaInterface, action: CardMetaReducerAction): CardMetaInterface => {
  switch (action.type) {
  case 'set-width':
    return {...state, width: action.payload.width};
  case 'set-rows':
    return {...state, rows: action.payload.rows};
  case 'set-cols':
    return {...state, cols: action.payload.cols};
  default:
    throw Error('Invalid Type');
  }
};

const CardContext = createContext(null);

const CardProvider = (props: any) => {
  const [cardData, cardDataDispatch] = useReducer(CardDataReducer, CardData, InitCardData);
  const [cardMeta, cardMetaDispatch] = useReducer(CardMetaReducer, CardMeta);
  const setAvailable = () => cardDataDispatch({type: 'set-available', payload: {available: true}});
  const setWidth = (width: number) => {
    if (cardMeta.width === width) return;
    cardMetaDispatch({type: 'set-width', payload: {width}});
  };
  const preSetRows = (rows: number) => {
    if (cardMeta.rows === rows) return;
    cardMetaDispatch({type: 'set-rows', payload: {rows}});
  };
  const setRows = async (rows: number) => {
    if (cardData.content.length !== rows) {
      cardDataDispatch({type: 'set-rows', payload: {rows}});
    }
  };
  const preSetCols = (cols: number) => {
    if (cardMeta.cols === cols) return;
    cardMetaDispatch({type: 'set-cols', payload: {cols}});
  };
  const setCols = async (cols: number) => {
    if (cardData.content[0].length !== cols) {
      cardDataDispatch({type: 'set-cols', payload: {cols}});
    }
  };
  const setType = (row: number, col: number, type: number) => {
    cardDataDispatch({type: 'set-type', payload: {row, col, type}});
  };
  const generate = async () => {
    cardDataDispatch({type: 'set-available', payload: {available: false}});
    cardDataDispatch({type: 'collapse'});
  };

  return <CardContext.Provider
    value={{
      cardMeta,
      cardData,
      setWidth,
      preSetRows,
      setRows,
      preSetCols,
      setCols,
      setType,
      setAvailable,
      clear: () => cardDataDispatch({type: 'clear'}),
      generate,
    }}
    {...props}/>;
};

type useCardContext = {
  cardMeta: CardMetaInterface,
  cardData: CardDataInterface,
  setWidth: (width: number) => void,
  preSetRows: (rows: number) => void,
  setRows: (rows: number) => void,
  preSetCols: (cols: number) => void,
  setCols: (cols: number) => void,
  setType: (row: number, col: number, type: number) => void,
  setAvailable: () => void,
  clear: () => void,
  generate: () => void,
}
const useCard = ():useCardContext => {
  const context = useContext(CardContext);
  if (!context) throw new Error('Not Inside the Provider');
  return context;
};

export {useCard, CardProvider, CardContentTypes};
