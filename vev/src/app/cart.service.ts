import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartItemRequestDTO, CartResponseDTO } from './Models/cart';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartsUrl = environment.cartsUrl; 

  constructor(private http: HttpClient) {}

  getCartByUserId(userId: number): Observable<CartResponseDTO> {
    return this.http.get<CartResponseDTO>(`${this.cartsUrl}/user/${userId}`);
  }

  addItem(cartItemRequestDTO: CartItemRequestDTO): Observable<CartResponseDTO> {
    return this.http.post<CartResponseDTO>(`${this.cartsUrl}/add-item`, cartItemRequestDTO);
  }

  removeProductFromCart(request: CartItemRequestDTO): Observable<CartResponseDTO> {
    return this.http.post<CartResponseDTO>(`${this.cartsUrl}/remove-item`, request);
  }

  emptyCart(userId: number): Observable<any> {
    return this.http.delete<any>(`${this.cartsUrl}/empty-cart/${userId}`);
  }
}

