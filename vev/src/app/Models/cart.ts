export interface Cart {
}

export interface CartItem {
    id: number;
    cartId: number;
    productId: number;
    quantity: number;
    price: number;
    productName: string;
  }
  
  export interface CartResponseDTO {
    id: number;
    userId: number;
    totalAmount: number;
    cartItems: CartItem[];
  }

  export interface CartItemRequestDTO {
    productId: number;
  }
