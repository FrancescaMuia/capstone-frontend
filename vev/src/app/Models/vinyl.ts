export interface Vinyl {
    id?: number;
  name: string;
  price: number;
  available: boolean;
  year: number;
  trackIds: number[];
  coverImg?: string;
  genre: string;
  recommendedWineIds?: number[];
  isInWishlist?: boolean;
}
