export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

const CATALOGUE: Product[] = [
  { id: 'PROD-001', name: 'Wireless Headphones', price: 79.99,  category: 'electronics' },
  { id: 'PROD-002', name: 'Mechanical Keyboard',  price: 129.99, category: 'electronics' },
  { id: 'PROD-003', name: 'USB-C Hub',             price: 34.99,  category: 'electronics' },
  { id: 'PROD-004', name: 'Desk Lamp',             price: 49.99,  category: 'furniture'   },
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
