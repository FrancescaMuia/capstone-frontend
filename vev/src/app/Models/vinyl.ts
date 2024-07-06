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
}

/* interface iwine {
  id: number;
  variety: string;
}
 */