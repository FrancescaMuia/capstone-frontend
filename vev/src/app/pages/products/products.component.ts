import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { VinylService } from '../../vinyls.service';
import { Vinyl } from '../../Models/vinyl';
import { Iwine } from '../../Models/iwine';
import { SimpleWine } from '../../Models/simplewine';
import { combineLatest } from 'rxjs';
import { iUser, Role } from '../../Models/iuser';
import { WishlistService } from '../../wishlist.service';
import { CartService } from '../../cart.service';
import { CartResponseDTO } from '../../Models/cart';
import { Router } from '@angular/router';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {

  vinyls: Vinyl[] = [];
  filteredVinyls: Vinyl[] = [];
  showAlert: boolean = false;
  alertMessage: string = '';

  showModal: boolean = false;
  selectedVinyl: Vinyl | null = null;
  //selectedRecommended: Iwine | null = null;
  selectedRecommended: SimpleWine | null = null;
  isAdmin: boolean = false
  currentUser: iUser | null = null;

  cart: CartResponseDTO | null = null;
  quantity: number = 1;


  constructor(private authSvc: AuthService, 
    private vinylSvc: VinylService, 
    private wishlistService: WishlistService,
    private cartService: CartService,
    private router: Router) { }

  ngOnInit(): void {
    this.loadVinyls(); // Chiamiamo prima il caricamento dei vinili

    this.authSvc.isAdmin().subscribe(isAdmin => {
      this.isAdmin = isAdmin;
      console.log('isAdmin:', this.isAdmin); // Log per verificare il valore di isAdmin
    });

    // Chiamiamo loadUserWishlist solo dopo che loadVinyls ha completato il caricamento dei vinili
    this.vinylSvc.getAll().subscribe((vinyls: Vinyl[]) => {
      this.loadUserWishlist();
    });

    this.vinylSvc.getAll().subscribe((vinyls: Vinyl[]) => {
      this.loadUserCart();
    });
  }

  loadVinyls() {
    this.vinylSvc.getAll().subscribe((vinyls: Vinyl[]) => {
      this.vinyls = vinyls; // Salva i vinili nell'array vinyls
      this.filteredVinyls = vinyls;
      console.log('Vinyls loaded:', this.vinyls);
    });
  }

  loadUserWishlist() {
    console.log("entrato in loadUserWishlist")
    const userId = this.authSvc.getCurrentUserId();
    if (userId) {
      console.log("entrato in user id")

      this.wishlistService.getWishlistByUserId(userId).subscribe((wishlist: any) => {
        // Aggiorna lo stato isInWishlist per ogni vinile in base alla wishlist dell'utente
        this.vinyls.forEach(vinyl => {
          console.log(vinyl)

          vinyl.isInWishlist = wishlist.products.some((product: any) => product.id === vinyl.id);
        });
      });
    }
  }

  loadUserCart(): void {
    const userId = this.authSvc.getCurrentUserId();
    if (userId) {
      this.cartService.getCartByUserId(userId).subscribe({
        next: (cart) => {
          this.cart = cart;
        },
        error: (error) => {
          console.error('Errore nel caricare il carrello dell\'utente', error);
        }
      });
    } else {
      console.error('ID utente non valido');
    }
  }
  

  /* loadVinyls() {
    this.vinylSvc.getAll().subscribe((vinyls: Vinyl[]) => {
      this.vinyls = vinyls; // Salva i vinili nell'array vinyls
      this.filteredVinyls = vinyls;
      console.log('Vinyls loaded:', this.vinyls);
    });
  } */
    

  openModal(vinyl: Vinyl): void {
    this.selectedVinyl = vinyl;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedRecommended = null; // Resetta la selezione quando si chiude la modale
  }

  addToCart(vinyl: Vinyl): void {
    const userId = this.authSvc.getCurrentUserId();
    if (!userId) {
      console.error('ID utente non valido');

      if (vinyl.id !== undefined) {
        this.authSvc.setDesiredAction({
          action: 'addToCart',
          vinylId: vinyl.id
        });
      } else {
        console.error('ID del vinile non valido');
      }

      this.router.navigate(['/auth/login']);
      return;
    }

    if (vinyl.id !== undefined) {
      const cartItemRequestDTO = {
        userId: userId,
        productId: vinyl.id,
        quantity: this.quantity
      };

      this.cartService.addItem(cartItemRequestDTO).subscribe({
        next: (response) => {
          console.log('Vinile aggiunto al carrello con successo!');
          this.alertMessage = vinyl.name + ' aggiunto al carrello!';
          this.showAlert = true;
          this.loadUserCart();

          // Aggiungi il vino selezionato al carrello, se esiste
          if (this.selectedRecommended) {
            const wineCartItemRequestDTO = {
              userId: userId,
              productId: this.selectedRecommended.id,
              quantity: 1
            };

            this.cartService.addItem(wineCartItemRequestDTO).subscribe({
              next: (response) => {
                console.log('Vino aggiunto al carrello con successo!');
                this.alertMessage += ' aggiunto al carrello!';
                setTimeout(() => {
                  this.showAlert = false;
                }, 4000);  // Estende il timeout per il messaggio di alert
              },
              error: (error) => {
                console.error('Errore nell\'aggiungere il vino al carrello', error);
              }
            });
          } else {
            setTimeout(() => {
              this.showAlert = false;
            }, 2000);
          }
        },
        error: (error) => {
          console.error('Errore nell\'aggiungere al carrello', error);
        }
      });
    } else {
      console.error('ID del vinile non valido');
    }
    this.showModal = false;
  }
  
  
  

  toggleWishlist(vinyl: Vinyl): void {
    const userId = this.authSvc.getCurrentUserId();
    if (!userId) {
      console.error('Invalid user ID');

      // Memorizza l'azione desiderata solo se vinyl.id è definito
      if (vinyl.id !== undefined) {
        this.authSvc.setDesiredAction({
          action: 'toggleWishlist',
          vinylId: vinyl.id
        });
      } else {
        console.error('Invalid vinyl ID');
      }

      // Reindirizza l'utente alla pagina di login solo se non è già autenticato
      this.authSvc.isLoggedIn$.subscribe((isLoggedIn) => {
      });
      return;
    }

    // Esegui l'azione sulla wishlist
    if (vinyl.id !== undefined) {
      if (vinyl.isInWishlist) {
        this.wishlistService.removeProductFromWishlist({ productId: vinyl.id }).subscribe({
          next: () => {
            console.log('Vinile rimosso dalla wishlist con successo!');
            vinyl.isInWishlist = false;
          },
          error: (error) => {
            console.error('Errore nella rimozione dalla wishlist', error);
          }
        });
      } else {
        this.wishlistService.addProductToWishlist({ productId: vinyl.id }).subscribe({
          next: () => {
            console.log('Vinile aggiunto alla wishlist con successo!');
            vinyl.isInWishlist = true;
          },
          error: (error) => {
            console.error('Errore nell\'aggiungere alla wishlist', error);
          }
        });
      }
    } else {
      console.error('ID del vinile non valido');
    }
  }

  showSearch(event: any): void {
    const searchTerm = event?.target.value.trim().toLowerCase();
    console.log('Search term:', searchTerm);
    if (searchTerm !== '') {
      this.filteredVinyls = this.vinyls.filter(vinyl =>
        vinyl.name.toLowerCase().includes(searchTerm) ||
        vinyl.year.toString().includes(searchTerm)
      );
    } else {
      this.filteredVinyls = [...this.vinyls];
    }
    console.log('Filtered vinyls:', this.filteredVinyls);
  }

  getRecommendedWines(): SimpleWine[] {
    if (this.selectedVinyl && this.selectedVinyl.recommendedWines) {
      console.log('Entrato nel ramo con vini consigliati:', this.selectedVinyl.recommendedWines);
      console.log('selectedVinyl:', this.selectedVinyl);
    console.log('recommendedWines:', this.selectedVinyl.recommendedWines);
      const recommendedWines = this.selectedVinyl.recommendedWines.map(wine => ({
        id: wine.id,
        price: wine.price,
        name: wine.name // Adatta a variety se questo è il nome corretto nel tuo backend
      }));
      console.log('Vini consigliati:', recommendedWines);
      return recommendedWines;
    }
    console.log('Nessun vinile selezionato o nessun vino consigliato.');
    return [];
  }
  
  

  selectRecommended(wine: SimpleWine): void {
    this.selectedRecommended = wine;
  }

  purchaseWine(): void {
    if (this.selectedRecommended) {
      console.log(`Acquisto effettuato per il vino con ID: ${this.selectedRecommended.id} e varietà: ${this.selectedRecommended.name}`);
      // Aggiungi la logica di acquisto qui
    }
  }

}