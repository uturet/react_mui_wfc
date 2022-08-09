import React, {createContext, useContext, useReducer} from 'react';
import {CardContentRelations, CardContentTypes} from './CardConfig';

type CardContent = Set<number>[][]
interface CardDataInterface {
  width: number
  ready: boolean
  content: CardContent
}
const CardData: CardDataInterface = {
  width: 12,
  ready: false,
  content: [],
};

const InitCardData = (initialData: CardDataInterface): CardDataInterface => {
  const rows = 3;
  const cols = 3;
  const content: Set<number>[][] = new Array(rows).fill(0).map((v) =>
    new Array(cols).fill(0).map((v) => new Set(CardContentTypes.map((_, i) => i))),
  );
  return {...initialData, ready: true, content};
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
        const ready = new Set<number>();
        cardData.content[cell[0]][cell[1]].forEach((t) => {
          CardContentRelations[t][i].forEach((v) => cardData.content[r][c].has(v) ? ready.add(v) : null);
        });
        cardData.content[r][c] = ready;
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
interface SetReadyInterface {
  type: 'set-ready'
  payload: {
    ready: boolean
  }
}
interface ClearCallsInterface {
  type: 'clear'|'collapse'
  payload?: undefined
}
type CardDataReducerAction = SetRowsInterface|SetColsInterface|SetTypeInterface|
SetWidthInterface|SetReadyInterface|ClearCallsInterface
const CardDataReducer = (state: CardDataInterface, action: CardDataReducerAction): CardDataInterface => {
  switch (action.type) {
  case 'set-width':
    return {...state, width: action.payload.width};
  case 'set-rows':
    if (state.content.length < action.payload.rows) {
      const newRows = new Array(action.payload.rows - state.content.length).fill(0).map((v) =>
        new Array(state.content[0].length).fill(0).map((v) => new Set(CardContentTypes.map((_, j) => j))),
      );
      const prevLastRow = state.content.length-1;
      const newState: CardDataInterface = {...state, ready: true, content: [...state.content, ...newRows]};
      newState.content[prevLastRow].forEach((c, i) => vaweFunction(prevLastRow, i, newState));
      return newState;
    }
    return {...state, ready: true, content: state.content.slice(0, action.payload.rows)};
  case 'set-cols':
    if (state.content[0].length < action.payload.cols) {
      const prevCols = state.content[0].length;
      const newState: CardDataInterface = {
        ...state,
        ready: true,
        content: state.content.map((r) => [...r, ...(new Array(action.payload.cols - prevCols)
          .fill(0).map((v) => new Set(CardContentTypes.map((_, j) => j))))]),
      };

      newState.content.forEach((r, i) => vaweFunction(i, prevCols-1, newState));
      return newState;
    }
    return {
      ...state,
      ready: true,
      content: state.content.map((r) => r.slice(0, action.payload.cols)),
    };
  case 'set-type':
    state.content[action.payload.row][action.payload.col] = new Set<number>([action.payload.type]);
    return vaweFunction(action.payload.row, action.payload.col, {...state, ready: true});
  case 'set-ready':
    return {...state, ready: action.payload.ready};
  case 'clear':
    const content: Set<number>[][] = new Array(state.content.length).fill(0).map((v) =>
      new Array(state.content[0].length).fill(0).map((v) => new Set(CardContentTypes.map((_, i) => i))),
    );
    return {...state, ready: true, content};
  case 'collapse':
    return vaweFunctionCollapse({...state, ready: true});
  default:
    throw Error('Invalid Type');
  }
};

const CardContext = createContext(null);

const CardProvider = (props: any) => {
  const [cardData, cardDataDispatch] = useReducer(CardDataReducer, CardData, InitCardData);
  const setWidth = (width: number) => {
    if (cardData.width === width) return;
    cardDataDispatch({type: 'set-width', payload: {width}});
  };
  const setRows = async (rows: number) => {
    if (cardData.content.length !== rows) {
      cardDataDispatch({type: 'set-ready', payload: {ready: false}});
      cardDataDispatch({type: 'set-rows', payload: {rows}});
    }
  };


  const setCols = (cols: number) => {
    if (cardData.content[0].length !== cols) {
      cardDataDispatch({type: 'set-ready', payload: {ready: false}});
      cardDataDispatch({type: 'set-cols', payload: {cols}});
    }
  };
  const setType = (row: number, col: number, type: number) => {
    cardDataDispatch({type: 'set-ready', payload: {ready: false}});
    cardDataDispatch({type: 'set-type', payload: {row, col, type}});
  };
  const clear = () => {
    cardDataDispatch({type: 'set-ready', payload: {ready: false}});
    cardDataDispatch({type: 'clear'});
  };
  const generate = () => {
    cardDataDispatch({type: 'set-ready', payload: {ready: false}});
    setTimeout(() => {
      cardDataDispatch({type: 'collapse'});
    }, 1000);
  };

  return <CardContext.Provider
    value={{
      cardData,
      setWidth,
      setRows,
      setCols,
      setType,
      clear,
      generate,
    }}
    {...props}/>;
};

type useCardContext = {
  cardData: CardDataInterface,
  setWidth: (width: number) => void,
  setRows: (rows: number) => void,
  setCols: (cols: number) => void,
  setType: (row: number, col: number, type: number) => void,
  clear: () => void,
  generate: () => void,
}
const useCard = ():useCardContext => {
  const context = useContext(CardContext);
  if (!context) throw new Error('Not Inside the Provider');
  return context;
};

export {useCard, CardProvider, CardContentTypes};
