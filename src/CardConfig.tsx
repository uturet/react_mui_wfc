export const border = '_border_';


type CardTypeRelations = Map<string, Set<string>[]>
export const CardTypeRelations: CardTypeRelations = new Map([
  ['Title', [
    new Set<string>([border, 'Accordion']),
    new Set<string>(['Title', 'Empty']),
    new Set<string>(),
    new Set<string>(['Title', 'Empty']),
  ]],
  ['Accordion', [
    new Set<string>([border]),
    new Set<string>(['Accordion']),
    new Set<string>(),
    new Set<string>(['Accordion']),
  ]],
  ['Empty', [
    new Set<string>(),
    new Set<string>(),
    new Set<string>(),
    new Set<string>(),
  ]],
  ['Chip', [
    new Set<string>(['Text field']),
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
    new Set<string>(['Table', 'Empty']),
    new Set<string>(),
    new Set<string>(['Table', 'Empty']),
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
  cc.forEach((relations, type) => {
    const e = cc.get('Empty');
    if (e) {
      e[0].add(type);
      e[1].add(type);
      e[2].add(type);
      e[3].add(type);
    }
  });
};
autoFillCardTypeRelations(CardTypeRelations);
export const CardContentTypes: string[] = Array.from(CardTypeRelations.keys());
