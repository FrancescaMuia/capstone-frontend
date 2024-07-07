import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { VinylService } from '../../vinyls.service';
import { Vinyl } from '../../Models/vinyl';
import { Iwine } from '../../Models/iwine';
import { SimpleWine } from '../../Models/simplewine';
import { combineLatest } from 'rxjs';
import { iUser, Role } from '../../Models/iuser';
import { WishlistService } from '../../wishlist.service';


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


  constructor(private authSvc: AuthService, private vinylSvc: VinylService, private wishlistService: WishlistService) { }

  ngOnInit(): void {
    this.loadVinyls(); // Chiamiamo prima il caricamento dei vinili

    // Chiamiamo loadUserWishlist solo dopo che loadVinyls ha completato il caricamento dei vinili
    this.vinylSvc.getAll().subscribe((vinyls: Vinyl[]) => {
      this.loadUserWishlist();
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
          this.alertMessage = vinyl.name + ' aggiunto al carrello!';
          this.showAlert = true;
          setTimeout(() => {
            this.showAlert = false;
          }, 2000);
        },
        error: (error) => {
          console.error('Errore nell\'aggiungere al carrello', error);
        }
      });
    } else {
      console.error('ID del vinile non valido');
    }
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
    if (searchTerm !== '') {
      this.filteredVinyls = this.vinyls.filter(vinyl =>
        vinyl.name.toLowerCase().includes(searchTerm) ||
        vinyl.year.toString().includes(searchTerm)
      );
    } else {
      this.filteredVinyls = [...this.vinyls];
    }
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