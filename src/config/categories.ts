export interface Subcategory {
  name: string;
  slug: string;
}

export interface CategoryGroup {
  name: string;
  slug: string;
  subcategories: Subcategory[];
}

export const PRODUCT_CATEGORIES_HIERARCHY: CategoryGroup[] = [
  {
    name: 'PINTURA',
    slug: 'pintura',
    subcategories: [
      { name: 'TECHOS', slug: 'techos' },
      { name: 'PISOS', slug: 'pisos' },
      { name: 'ESPECIALES', slug: 'especiales' },
      { name: 'MADERA', slug: 'madera' },
      { name: 'PILETAS', slug: 'piletas' },
      { name: 'EXTERIOR', slug: 'exterior' },
      { name: 'LADRILLOS', slug: 'ladrillos' },
      { name: 'METAL', slug: 'metal' },
      { name: 'INTERIOR', slug: 'interior' },
    ]
  },
  {
    name: 'AUTOMOTOR',
    slug: 'automotor',
    subcategories: [
      { name: 'R.O AUTOMOTIVE', slug: 'ro-automotive' },
      { name: 'PULIDO', slug: 'pulido' },
      { name: 'ACCESORIOS', slug: 'accesorios-automotor' },
      { name: 'DETAILING', slug: 'detailing' },
    ]
  },
  {
    name: 'ACCESORIOS',
    slug: 'accesorios',
    subcategories: [
      { name: 'RODILLOS', slug: 'rodillos' },
      { name: 'PINCELES', slug: 'pinceles' },
      { name: 'CINTAS', slug: 'cintas' },
      { name: 'COMPLEMENTOS', slug: 'complementos' },
      { name: 'PROTECCION', slug: 'proteccion' },
      { name: 'DISCOS', slug: 'discos' },
      { name: 'LIJAS', slug: 'lijas' },
    ]
  },
  {
    name: 'PREP. DE SUPERFICIES',
    slug: 'prep-superficies',
    subcategories: [
      { name: 'ENDUIDO', slug: 'enduido' },
      { name: 'FIJADORES', slug: 'fijadores' },
      { name: 'REPARACIÓN', slug: 'reparacion' },
      { name: 'SELLADORES', slug: 'selladores' },
    ]
  },
  {
    name: 'AEROSOLES',
    slug: 'aerosoles',
    subcategories: [
      { name: 'TERSUAVE', slug: 'tersuave' },
      { name: 'RUST OLEUM', slug: 'rust-oleum' },
    ]
  }
];
