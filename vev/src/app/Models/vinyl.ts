import { SimpleWine } from "./simplewine";

export interface Vinyl {
    id?: number;
  name: string;
  price: number;
  available: boolean;
  year: number;
  trackIds: number[];
  coverImg?: string;
  genre: string;
  recommendedWines: SimpleWine[];
  isInWishlist?: boolean;
  isInCart?: boolean;
  recommendedWineIds?: number[]
}

/* interface iwine {
  id: number;
  variety: string;
}
 */