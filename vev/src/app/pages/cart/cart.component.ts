/* import { Component, HostListener, TemplateRef, inject } from '@angular/core';
import { Vinyl } from '../../Models/vinyl';
import { AuthService } from '../../auth/auth.service';
import { VinylService } from '../../vinyls.service'; // Assicurati di importare il servizio corretto per i vinili

import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {

  vinyls: Vinyl[] = []; // Array di vinili nel carrello
  currentUserCartVinyls: Vinyl[] = []; // Vinili nel carrello dell'utente corrente
  vinylCount: { [vinylId: number]: number } = {}; // Contatore per ciascun vinile nel carrello
  totalCartPrice: number = 0; // Prezzo totale del carrello
  showAlert: boolean = false; // Flag per mostrare l'alert di acquisto effettuato

  scrolled: boolean = false;

  private offcanvasService = inject(NgbOffcanvas);

  constructor(private authSvc: AuthService, private vinylSvc: VinylService) { }

  ngOnInit(): void {
    this.loadCart();
  }

  addToCart(vinyl: Vinyl): void {
    console.log('Aggiunta al carrello in corso...');
    const userId = this.authSvc.getCurrentUserId();
    if (!userId) {
      console.error('ID utente non valido');
      return;
    }

    if (vinyl.id !== undefined) { 
    this.authSvc.addCart(userId, vinyl.id).subscribe({
      next: () => {
        console.log('Vinile aggiunto al carrello con successo!');
        this.updateTotalCartPrice();
      },
      error: (error) => {
        console.error('Errore nell\'aggiungere al carrello', error);
      }
    });
  } else {
    console.error('Vinyl.id è undefined, non posso aggiungere al carrello.');
  }
  }

  loadCart(): void {
    this.authSvc.user$.subscribe(user => {
      if (user && user.cart && user.cart.length > 0) {
        const vinylCount: { [vinylId: number]: number } = {};
        user.cart.forEach((vinylId) => {
          vinylCount[vinylId] = (vinylCount[vinylId] || 0) + 1;
        });
        this.vinylSvc.getCart(user.cart).subscribe(vinyls => {
          this.currentUserCartVinyls = vinyls;
          this.currentUserCartVinyls.forEach(vinyl => {
            vinyl.isInCart = (vinylCount[vinyl.id] || 0) >= 2;
          });
          this.vinylCount = vinylCount;
          this.updateTotalCartPrice();
        });
      } else {
        this.currentUserCartVinyls = [];
      }
    });
  }

  removeFromCart(vinylId: number): void {
    const userId = this.authSvc.getCurrentUserId();
    if (userId) {
      if (this.vinylCount[vinylId] && this.vinylCount[vinylId] > 0) {
        this.authSvc.deleteCart(userId, vinylId).subscribe({
          next: () => {
            console.log('Vinile rimosso dal carrello con successo!');
            this.vinylCount[vinylId]--;
            if (this.vinylCount[vinylId] === 0) {
              this.currentUserCartVinyls = this.currentUserCartVinyls.filter(v => v.id !== vinylId);
            }
            this.updateTotalCartPrice();
          },
          error: (error) => console.error('Errore nella rimozione dal carrello', error)
        });
      }
    } else {
      console.error('ID utente non valido');
    }
  }

  emptyCart(userId: number): void {
    this.authSvc.emptyCart(userId);
  }

  updateTotalCartPrice(): void {
    this.totalCartPrice = this.currentUserCartVinyls.reduce((total, vinyl) => {
      return total + (vinyl.price * (this.vinylCount[vinyl.id] || 1));
    }, 0);
  }

  openEnd(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'end' });
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
 */