import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WishlistDTO, WishlistProductRequestDTO } from './Models/wishlist';
import { environment } from '../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  
  private wishlistsUrl = environment.wishlistUrl;

  constructor(private http: HttpClient) { }

  getWishlistByUserId(userId: number): Observable<WishlistDTO> {
    return this.http.get<WishlistDTO>(`${this.wishlistsUrl}/user/${userId}`);
  }

  addProductToWishlist(request: WishlistProductRequestDTO): Observable<WishlistDTO> {
    return this.http.post<WishlistDTO>(`${this.wishlistsUrl}/add-product`, request);
  }

  removeProductFromWishlist(request: WishlistProductRequestDTO): Observable<WishlistDTO> {
    return this.http.post<WishlistDTO>(`${this.wishlistsUrl}/remove-product`, request);
  }
}
