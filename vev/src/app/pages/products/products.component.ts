import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { VinylService } from '../../vinyls.service';
import { Vinyl } from '../../Models/vinyl';
import { Iwine } from '../../Models/iwine';
import { SimpleWine } from '../../Models/simplewine';
import { combineLatest } from 'rxjs';
import { iUser, Role } from '../../Models/iuser';


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


  constructor(private authSvc: AuthService, private vinylSvc: VinylService) { }

  ngOnInit(): void {
    this.loadVinyls();
  }

  /* loadVinyls() {
    this.vinylSvc.getAll().subscribe((vinyls: Vinyl[]) => {
      this.vinyls = vinyls; // Salva i vinili nell'array vinyls
      this.filteredVinyls = vinyls;
      console.log('Vinyls loaded:', this.vinyls);
    });
  } */

    loadVinyls() {
      this.authSvc.user$.subscribe((user: iUser | null) => {
        console.log('User data:', user); 
        if (user) {
          this.isAdmin = !!user.roles && user.roles.some(role => role.roleType === 'ADMIN');
        } else {
          this.isAdmin = false;
        }
  
        this.vinylSvc.getAll().subscribe((vinyls: Vinyl[]) => {
          this.vinyls = vinyls;
          this.filteredVinyls = vinyls;
          console.log('Vinyls loaded:', this.vinyls);
        });
      });
    }
    

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
      console.error('ID utente non valido');
      return;
    }

    if (vinyl.id !== undefined) {
      if (vinyl.isInWishlist) {
        this.authSvc.deleteWish(userId, vinyl.id).subscribe({
          next: () => {
            console.log('Vinile rimosso dalla wishlist con successo!');
            vinyl.isInWishlist = false;
          },
          error: (error) => {
            console.error('Errore nella rimozione dalla wishlist', error);
          }
        });
      } else {
        this.authSvc.addWish(userId, vinyl.id).subscribe({
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
      const recommendedWines = this.selectedVinyl.recommendedWines.map(wine => ({
        id: wine.id,
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