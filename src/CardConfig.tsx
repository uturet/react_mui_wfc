type CardContent = Map<string, Set<number>[]>
const CardContent: CardContent = new Map([
  ['Chip', [
    new Set<number>(),
    new Set<number>(),
    new Set<number>(),
    new Set<number>(),
  ]],
  ['Divider', [
    new Set<number>(),
    new Set<number>([1]),
    new Set<number>(),
    new Set<number>([1]),
  ]],
  ['Table', [
    new Set<number>(),
    new Set<number>([2, 3]),
    new Set<number>(),
    new Set<number>([2, 3]),
  ]],
  ['Chart', [
    new Set<number>(),
    new Set<number>([2, 3]),
    new Set<number>(),
    new Set<number>([2, 3]),
  ]],
  ['Text', [
    new Set<number>(),
    new Set<number>([4, 0, 7]),
    new Set<number>(),
    new Set<number>([4, 0, 7]),
  ]],
  ['Image', [
    new Set<number>(),
    new Set<number>([4, 5, 6]),
    new Set<number>(),
    new Set<number>([4, 5, 6]),
  ]],
  ['Image list', [
    new Set<number>(),
    new Set<number>([5, 6]),
    new Set<number>(),
    new Set<number>([5, 6]),
  ]],
  ['Button', [
    new Set<number>(),
    new Set<number>(),
    new Set<number>(),
    new Set<number>(),
  ]],
  ['Checkbox', [
    new Set<number>(),
    new Set<number>([4, 7, 0]),
    new Set<number>(),
    new Set<number>([4, 7, 0]),
  ]],
  ['Radio button', [
    new Set<number>(),
    new Set<number>([4, 7, 0]),
    new Set<number>(),
    new Set<number>([4, 7, 0]),
  ]],
  ['Select', [
    new Set<number>(),
    new Set<number>([4, 7, 0]),
    new Set<number>(),
    new Set<number>([4, 7, 0]),
  ]],
  ['Slider', [
    new Set<number>(),
    new Set<number>([4, 7, 0]),
    new Set<number>(),
    new Set<number>([4, 7, 0]),
  ]],
  ['Switch', [
    new Set<number>(),
    new Set<number>([4, 7, 0]),
    new Set<number>(),
    new Set<number>([4, 7, 0]),
  ]],
  ['Text field', [
    new Set<number>(),
    new Set<number>([4, 7, 0]),
    new Set<number>(),
    new Set<number>([4, 7, 0]),
  ]],
]);
const autoFillCardContent = (cc: CardContent) => {
  const types = Array.from(cc.keys());
  const defaultRelations = [
    new Set<number>(types.map((v, i) => i)),
    new Set<number>(types.map((v, i) => i)),
    new Set<number>(types.map((v, i) => i)),
    new Set<number>(types.map((v, i) => i)),
  ];
  cc.forEach((relations, type) => {
    const typeIndex = types.indexOf(type);
    relations.forEach((rs, side) => {
      if (rs.size === 0) return;
      defaultRelations[(side+2)%4].delete(typeIndex);
    });
  });
  cc.forEach((relations, type) => {
    relations.forEach((rs, side) => {
      if (rs.size === 0) {
        const v = cc.get(type);
        if (v) defaultRelations[side].forEach((t) => v[side].add(t));
      }
    });
  });
  cc.forEach((relations, type) => {
    relations.forEach((rs, side) => {
      const typeIndex = types.indexOf(type);
      rs.forEach(((r) => {
        if (r === typeIndex) return;
        const v = cc.get(types[r]);
        if (v) v[(side+2)%4].add(typeIndex);
      }));
    });
  });
};
autoFillCardContent(CardContent);

export const CardContentTypes: string[] = Array.from(CardContent.keys());
// [ [top{}, right{}, bot{}, left{}] ]
export type CardContentRelations = Set<number>[][]
export const CardContentRelations: CardContentRelations = Array.from(CardContent.values());
