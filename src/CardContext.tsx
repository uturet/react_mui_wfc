import React, {createContext, useContext, useReducer} from 'react';
import {
  CardTypeRelations,
  CardContentTypes,
  border,
  notBorder,
} from './CardConfig';
type CardCell = {values: Set<string>, size: number, modified: boolean}
type CardContent = CardCell[][]

interface CardDataInterface {
  width: number
  ready: boolean
  collapsed: boolean
  content: CardContent
}
const CardData: CardDataInterface = {
  width: 8,
  ready: false,
  collapsed: false,
  content: [],
};

const generateCellValues = (row: number, col: number, rows: number, cols: number): Set<string> => (
  new Set(CardContentTypes.filter((t) => {
    let res = true;
    const type = CardTypeRelations.get(t);
    if (type === undefined) {
      return false;
    }
    if (type[0].has(border)) res = res && row === 0;
    if (type[0].has(notBorder)) res = res && row !== 0;
    if (type[1].has(border)) res = res && col === cols-1;
    if (type[1].has(notBorder)) res = res && col !== cols-1;
    if (type[3].has(border)) res = res && col === 0;
    if (type[3].has(notBorder)) res = res && col !== 0;
    if (type[2].has(border)) res = res && row === rows-1;
    if (type[2].has(notBorder)) res = res && row !== rows-1;
    return res;
  })));

const generateContent = (rows: number, cols: number): CardContent => {
  return new Array(rows).fill(0).map((_, r) =>
    new Array(cols).fill(0).map((_, c) => ({
      modified: false,
      size: 1,
      values: generateCellValues(r, c, rows, cols),
    })),
  );
};

const fixUnmodifiedRow = (row: number, cc: CardDataInterface) => {
  if (cc.content[row].some((c) => c.modified)) return;
  cc.content[row].forEach((_, col) => {
    cc.content[row][col].values = generateCellValues(row, col, cc.content.length, cc.content[0].length);
  });
};

const InitCardData = (initialData: CardDataInterface): CardDataInterface => {
  const rows = 3;
  const cols = 3;
  const content: CardContent = generateContent(rows, cols);
  return {...initialData, ready: true, content};
};

const findJoinedCells = (cardData: CardDataInterface): CardDataInterface => {
  if (cardData.collapsed) return cardData;
  cardData.content.forEach((r, i) => {
    let colIndex = -1;
    r.forEach((c, j) => {
      if (j === 0) return;
      if (r[j-1].values.values().next().value === c.values.values().next().value) {
        cardData.content[i][j].size = 0;
        if (colIndex === -1) {
          colIndex = j-1;
        }
        cardData.content[i][colIndex].size++;
      } else {
        colIndex = -1;
      };
    });
  });
  return {...cardData, collapsed: true};
};

const isCollapsed = (cardData: CardDataInterface): CardDataInterface => {
  for (let r=0; r<cardData.content.length; r++) {
    for (let c=0; c<cardData.content[0].length; c++) {
      if (cardData.content[r][c].values.size > 1) return cardData;
    }
  }

  return findJoinedCells(cardData);
};

const vaweFunction = (row: number, col: number, cardData: CardDataInterface): CardDataInterface => {
  if (cardData.content[row][col].values.size === CardTypeRelations.size) return cardData;
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
    if (cardData.content[cell[0]][cell[1]].values.size === CardTypeRelations.size) continue;

    dir.forEach((d, i) => {
      const r: number = cell[0] + d[0];
      const c: number = cell[1] + d[1];
      const index = posToIndex(r, c);
      if (-1 < r && r < cardData.content.length && -1 < c && c < cardData.content[0].length &&
        cardData.content[r][c].values.size > 1 && !changedCells.has(index)) {
        nextCells.add(index);
        changedCells.add(index);
        const ready = new Set<string>();
        cardData.content[cell[0]][cell[1]].values.forEach((t) => {
          const v = CardTypeRelations.get(t);
          if (v) v[i].forEach((v) => cardData.content[r][c].values.has(v) ? ready.add(v) : null);
        });
        if (cardData.content[r][c].values.size !== ready.size) {
          cardData.content[r][c].modified = true;
          cardData.content[r][c].values = ready;
        }
      }
    });
  }
  return cardData;
};

const vaweFunctionCollapse = (cardData: CardDataInterface): CardDataInterface => {
  let row = 0;
  let col = 0;
  let begin = true;
  cardData.content.forEach((r, i) => {
    r.forEach((c, j) => {
      if (c.values.size < cardData.content[row][col].values.size) {
        row = i;
        col = j;
      }
    });
  });

  while (begin) {
    if (cardData.content[row][col].values.size > 0) {
      cardData.content[row][col].values = new Set([
        Array.from(cardData.content[row][col].values)[Math.floor(Math.random()*cardData.content[row][col].values.size)],
      ]);
    }
    cardData = vaweFunction(row, col, cardData);
    begin = false;
    cardData.content.forEach((r, i) => {
      r.forEach((c, j) => {
        if ((cardData.content[row][col].values.size === 1 && c.values.size > 1) ||
        (c.values.size > 1 && c.values.size < cardData.content[row][col].values.size)) {
          row = i;
          col = j;
          begin = true;
        }
      });
    });
  }

  return findJoinedCells(cardData);
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
    type: string
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
      const newRows = generateContent(action.payload.rows - state.content.length + 1, state.content[0].length);
      const prevLastRow = state.content.length-1;
      const newState: CardDataInterface = {
        ...state, ready: true, content: [...state.content, ...newRows.slice(1, newRows.length)]};
      fixUnmodifiedRow(prevLastRow, newState);
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
        content: state.content.map((r, row) => [...r, ...(new Array(action.payload.cols - prevCols)
          .fill(0).map((_, col) => ({
            modified: false,
            size: 1,
            values: generateCellValues(row, col, state.content.length, action.payload.cols),
          }))),
        ]),
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
    state.content[action.payload.row][action.payload.col].values = new Set<string>([action.payload.type]);
    state.content[action.payload.row][action.payload.col].modified = true;
    return isCollapsed(vaweFunction(action.payload.row, action.payload.col, {...state, ready: true}));
  case 'set-ready':
    return {...state, ready: action.payload.ready};
  case 'clear':
    const content: CardContent = generateContent(state.content.length, state.content[0].length);
    return {...state, collapsed: false, ready: true, content};
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
  const setType = (row: number, col: number, type: string) => {
    cardDataDispatch({type: 'set-ready', payload: {ready: false}});
    cardDataDispatch({type: 'set-type', payload: {row, col, type}});
  };
  const clear = () => {
    cardDataDispatch({type: 'set-ready', payload: {ready: false}});
    cardDataDispatch({type: 'clear'});
  };
  const generate = () => {
    cardDataDispatch({type: 'set-ready', payload: {ready: false}});
    cardDataDispatch({type: 'collapse'});
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
  setType: (row: number, col: number, type: string) => void,
  clear: () => void,
  generate: () => void,
}
const useCard = ():useCardContext => {
  const context = useContext(CardContext);
  if (!context) throw new Error('Not Inside the Provider');
  return context;
};

export {useCard, CardProvider, CardContentTypes};
