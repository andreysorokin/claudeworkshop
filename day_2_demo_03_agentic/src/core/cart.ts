export interface CartItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export function addItem(cart: CartItem[], item: CartItem): CartItem[] {
  const existing = cart.find((i) => i.productId === item.productId);
  if (existing) {
    return cart.map((i) =>
      i.productId === item.productId
        ? { ...i, quantity: i.quantity + item.quantity }
        : i,
    );
  }
  return [...cart, item];
}

export function removeItem(cart: CartItem[], productId: string): CartItem[] {
  return cart.filter((i) => i.productId !== productId);
}

export function cartTotal(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

export function isEmpty(cart: CartItem[]): boolean {
  return cart.length === 0;
}
