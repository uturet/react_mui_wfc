export const border = '_border_';
export const notBorder = '_not_border_';
export const notEmpty = '_not_empty_';

type CardTypeRelations = Map<string, Set<string>[]>
export const CardTypeRelations: CardTypeRelations = new Map([
  ['Title', [
    new Set<string>([border, notEmpty]),
    new Set<string>(['Title', notEmpty]),
    new Set<string>(),
    new Set<string>(['Title', notEmpty]),
  ]],
  ['Accordion', [
    new Set<string>([border, notEmpty]),
    new Set<string>(['Accordion', notEmpty]),
    new Set<string>(),
    new Set<string>(['Accordion', notEmpty]),
  ]],
  ['Empty', [
    new Set<string>([notBorder]),
    new Set<string>(),
    new Set<string>(),
    new Set<string>(),
  ]],
  ['Chip', [
    new Set<string>([notBorder]),
    new Set<string>(),
    new Set<string>(),
    new Set<string>(),
  ]],
  ['Divider', [
    new Set<string>([notBorder]),
    new Set<string>(['Divider', notEmpty]),
    new Set<string>([notBorder]),
    new Set<string>(['Divider', notEmpty]),
  ]],
  ['Table', [
    new Set<string>([notBorder]),
    new Set<string>(['Table', notEmpty]),
    new Set<string>(),
    new Set<string>(['Table', notEmpty]),
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
    new Set<string>([notBorder]),
    new Set<string>([border]),
    new Set<string>([border]),
    new Set<string>(),
  ]],
  ['Checkbox', [
    new Set<string>([notBorder]),
    new Set<string>(['Text', 'Button', 'Chip']),
    new Set<string>(),
    new Set<string>(['Text', 'Button', 'Chip']),
  ]],
  ['Radio button', [
    new Set<string>([notBorder]),
    new Set<string>(['Text', 'Button', 'Chip', 'Radio button']),
    new Set<string>(),
    new Set<string>(['Text', 'Button', 'Chip', 'Radio button']),
  ]],
  ['Select', [
    new Set<string>([notBorder]),
    new Set<string>(['Text', 'Button', 'Chip']),
    new Set<string>(),
    new Set<string>(['Text', 'Button', 'Chip']),
  ]],
  ['Slider', [
    new Set<string>([notBorder]),
    new Set<string>(['Text', 'Button', 'Chip']),
    new Set<string>(),
    new Set<string>(['Text', 'Button', 'Chip']),
  ]],
  ['Switch', [
    new Set<string>([notBorder]),
    new Set<string>(['Text', 'Button', 'Chip']),
    new Set<string>(),
    new Set<string>(['Text', 'Button', 'Chip']),
  ]],
  ['Text field', [
    new Set<string>([notBorder]),
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
      if (rs.size === 0 || rs.has(notBorder) && rs.size === 1 ||
        rs.has(border) && rs.size === 1) return;
      defaultRelations[(side+2)%4].delete(type);
    });
  });
  cc.forEach((relations, type) => {
    const e = cc.get('Empty');
    if (e) {
      if (!relations[0].has(notEmpty)) e[0].add(type);
      if (!relations[1].has(notEmpty)) e[1].add(type);
      if (!relations[2].has(notEmpty)) e[2].add(type);
      if (!relations[3].has(notEmpty)) e[3].add(type);
    }
  });
  cc.forEach((relations, type) => {
    relations.forEach((rs, side) => {
      if (rs.size === 0 || rs.has(notBorder) && rs.size === 1 ||
       rs.has(border) && rs.size === 1) {
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
