import { Component, HostListener, TemplateRef, inject } from '@angular/core';
import { Vinyl } from '../../Models/vinyl';
import { AuthService } from '../../auth/auth.service';
import { VinylService } from '../../vinyls.service'; // Assicurati di importare il servizio corretto per i vinili
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { CartService } from '../../cart.service';
import { CartItem, CartItemRequestDTO, CartResponseDTO } from '../../Models/cart';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {

  vinyls: Vinyl[] = []; // Array di vinili nel carrello
  currentUserCartVinyls: CartItem[] = []; // CartItem nel carrello dell'utente corrente
  vinylCount: { [vinylId: number]: number } = {}; // Contatore per ciascun vinile nel carrello
  totalCartPrice: number = 0; // Prezzo totale del carrello
  showAlert: boolean = false; // Flag per mostrare l'alert di acquisto effettuato
  scrolled: boolean = false;

  private offcanvasService = inject(NgbOffcanvas);

  constructor(private authSvc: AuthService, private vinylSvc: VinylService, private cartService: CartService) { }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    const userId = this.authSvc.getCurrentUserId();
    if (userId) {
      this.cartService.getCartByUserId(userId).subscribe((cart: CartResponseDTO) => {
        const vinylCount: { [vinylId: number]: number } = {};
        const vinyls: CartItem[] = cart.cartItems.map(cartItem => {
          vinylCount[cartItem.productId] = cartItem.quantity;
          return cartItem as CartItem;
        });

        this.currentUserCartVinyls = vinyls;
        console.log(this.currentUserCartVinyls);
        this.vinylCount = vinylCount;
        this.updateTotalCartPrice();
      });
    }
  }

  
  removeFromCart(productId: number): void {
    const userId = this.authSvc.getCurrentUserId();
    if (userId) {
      const request: CartItemRequestDTO = { productId };
      this.cartService.removeProductFromCart(request).subscribe((cart: CartResponseDTO) => {
        this.currentUserCartVinyls = cart.cartItems;
        this.currentUserCartVinyls.forEach(cartItem => {
          this.vinylCount[cartItem.productId] = cartItem.quantity;
        });
        
      }, error => {
        console.error('Errore nella rimozione dal carrello', error);
      });
    } else {
      console.error('ID utente non valido');
    }
  }
  

  emptyCart(userId: number): void {
    this.authSvc.emptyCart(userId);
  }

  updateTotalCartPrice(): void {
    this.totalCartPrice = this.currentUserCartVinyls.reduce((total, vinyl) => {
      if (vinyl.id !== undefined && vinyl.price !== undefined) {
        return total + (vinyl.price * (this.vinylCount[vinyl.id] || 1));
      }
      return total;
    }, 0);
  }

  openEnd(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'end' });
  }

  checkout(): void {
    const userId = this.authSvc.getCurrentUserId();
    if (userId) {
      this.cartService.emptyCart(userId).subscribe({
        next: () => {
          console.log('Carrello svuotato con successo');
          this.loadCart();
          this.showAlert = true;
          setTimeout(() => {
            this.showAlert = false;
          }, 2000);
        },
        error: (error) => {
          console.error('Errore durante lo svuotamento del carrello', error);
        }
      });
    } else {
      console.error('ID utente non valido');
    }
  }

  checkoutCompleted() {
    const userId = this.authSvc.getCurrentUserId();
    if (userId) {
      this.authSvc.emptyCart(userId).subscribe({
        next: () => {
          console.log('Carrello svuotato con successo');
          this.loadCart();
          this.showAlert = true;
          setTimeout(() => {
            this.showAlert = false;
          }, 2000);
        },
        error: (error) => {
          console.error('Errore durante lo svuotamento del carrello', error);
        }
      });
    } else {
      console.error('ID utente non valido');
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (window.pageYOffset > 155) {
      this.scrolled = true;
    } else {
      this.scrolled = false;
    }
  }
}
