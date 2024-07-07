export interface Artist {
    id: number;
    name: string;
  }
  
  export interface Track {
    id: number;
    name: string;
    duration: number;
    artists: Artist[];
  }
  
  export interface Product {
    id: number;
    name: string;
    price: number;
    available: boolean;
    year: number;
    tracks: Track[];
    coverImg: string;
    genre: string;
    recommendedWines: any[]; // Tipo degli elementi raccomandati da definire
  }
  
  export interface User {
    id: number;
    username: string;
    email: string;
    name: string;
    surname: string;
    city: string;
    toponym: string;
    addressName: string;
    streetNumber: string;
    zipCode: string;
    phoneNumber: string;
    password: string;
    avatar: string;
    roles: { roleType: string }[];
    wishlist: {
      id: number;
      products: Product[];
    };
  }
  
  export interface WishlistData {
    id: number;
    user: User;
    products: Product[];
  }
  
  export interface WishlistResponse {
    id: number;
    products: Product[];
  }
  
  export interface WishlistDTO {
    id: number;
    user: User;
    products: Product[];
  }


    export interface WishlistProductRequestDTO {
    productId: number;
  }

  