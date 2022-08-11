type CardTypeRelations = Map<string, Set<string>[]>
export const CardTypeRelations: CardTypeRelations = new Map([
  ['Chip', [
    new Set<string>(),
    new Set<string>(),
    new Set<string>(),
    new Set<string>(),
  ]],
  ['Divider', [
    new Set<string>(),
    new Set<string>(['Divider']),
    new Set<string>(),
    new Set<string>(['Divider']),
  ]],
  ['Table', [
    new Set<string>(),
    new Set<string>(['Table']),
    new Set<string>(),
    new Set<string>(['Table']),
  ]],
  ['Text', [
    new Set<string>(),
    new Set<string>(['Text', 'Chip', 'Button']),
    new Set<string>(),
    new Set<string>(['Text', 'Chip', 'Button']),
  ]],
  ['Image', [
    new Set<string>(),
    new Set<string>(['Text', 'Image', 'Image list']),
    new Set<string>(),
    new Set<string>(['Text', 'Image', 'Image list']),
  ]],
  ['Image list', [
    new Set<string>(),
    new Set<string>(['Image', 'Image list']),
    new Set<string>(),
    new Set<string>(['Image', 'Image list']),
  ]],
  ['Button', [
    new Set<string>(),
    new Set<string>(),
    new Set<string>(),
    new Set<string>(),
  ]],
  ['Checkbox', [
    new Set<string>(),
    new Set<string>(['Text', 'Button', 'Chip']),
    new Set<string>(),
    new Set<string>(['Text', 'Button', 'Chip']),
  ]],
  ['Radio button', [
    new Set<string>(),
    new Set<string>(['Text', 'Button', 'Chip', 'Radio button']),
    new Set<string>(),
    new Set<string>(['Text', 'Button', 'Chip', 'Radio button']),
  ]],
  ['Select', [
    new Set<string>(),
    new Set<string>(['Text', 'Button', 'Chip']),
    new Set<string>(),
    new Set<string>(['Text', 'Button', 'Chip']),
  ]],
  ['Slider', [
    new Set<string>(),
    new Set<string>(['Text', 'Button', 'Chip']),
    new Set<string>(),
    new Set<string>(['Text', 'Button', 'Chip']),
  ]],
  ['Switch', [
    new Set<string>(),
    new Set<string>(['Text', 'Button', 'Chip']),
    new Set<string>(),
    new Set<string>(['Text', 'Button', 'Chip']),
  ]],
  ['Text field', [
    new Set<string>(),
    new Set<string>(['Text', 'Button', 'Chip']),
    new Set<string>(),
    new Set<string>(['Text', 'Button', 'Chip']),
  ]],
]);
const autoFillCardTypeRelations = (cc: CardTypeRelations) => {
  const defaultRelations = [
    new Set<string>(Array.from(cc.keys())),
    new Set<string>(Array.from(cc.keys())),
    new Set<string>(Array.from(cc.keys())),
    new Set<string>(Array.from(cc.keys())),
  ];
  cc.forEach((relations, type) => {
    relations.forEach((rs, side) => {
      if (rs.size === 0) return;
      defaultRelations[(side+2)%4].delete(type);
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
      rs.forEach(((r) => {
        if (r === type) return;
        const v = cc.get(r);
        if (v) v[(side+2)%4].add(type);
      }));
    });
  });
};
autoFillCardTypeRelations(CardTypeRelations);
export const CardContentTypes: string[] = Array.from(CardTypeRelations.keys());
