export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

const CATALOGUE: Product[] = [
  { id: 'PROD-001', name: 'English Saddle',    price: 249.99, category: 'tack'  },
  { id: 'PROD-002', name: 'Leather Bridle',    price: 89.99,  category: 'tack'  },
  { id: 'PROD-003', name: 'Horseshoe Set',     price: 34.99,  category: 'care'  },
  { id: 'PROD-004', name: 'Grooming Kit',      price: 24.99,  category: 'care'  },
];

export function getAllProducts(): Product[] {
  return [...CATALOGUE];
}

export function getProductById(id: string): Product | undefined {
  return CATALOGUE.find((p) => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  return CATALOGUE.filter((p) => p.category === category);
}
