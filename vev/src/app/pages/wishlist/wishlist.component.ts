import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { switchMap } from 'rxjs/operators';
import { Vinyl } from '../../Models/vinyl';
import { WishlistService } from '../../wishlist.service';
import { WishlistDTO } from '../../Models/wishlist';
import { VinylService } from '../../vinyls.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
  currentUserWishlistVinyls: Vinyl[] = [];
  showAlert: boolean = false;
  alertMessage: string = '';
  vinyls:any;
  filteredVinyls:any;

  constructor(
    private authSvc: AuthService,
    private wishlistService: WishlistService,
    private vinylSvc: VinylService
  ) {}

  ngOnInit(): void {
    this.vinylSvc.getAll().subscribe((vinyls: Vinyl[]) => {
      console.log(vinyls);
      this.vinyls = vinyls;
      this.filteredVinyls = vinyls;
      console.log('Vinyls loaded:', this.vinyls);
  
      // Carica la wishlist dell'utente dopo aver caricato i vinili
      this.loadUserWishlist();
    });
  }

  loadUserWishlist(): void {
    console.log("Entrato in loadUserWishlist");
    const userId = this.authSvc.getCurrentUserId();
    if (userId) {
      console.log("Entrato in user id");
  
      this.wishlistService.getWishlistByUserId(userId).subscribe((wishlist: WishlistDTO) => {
        // Aggiorna lo stato isInWishlist per ogni vinile in base alla wishlist dell'utente
        this.vinyls.forEach((vinyl:any) => {
          vinyl.isInWishlist = wishlist.products.some(product => product.id === vinyl.id);
        });
        this.filteredVinyls=this.vinyls.filter((vinyl:any) => vinyl.isInWishlist);
      });
    }
  }
  


  removeFromWishlist(productId: number): void {
    const userId = this.authSvc.getCurrentUserId();
    if (userId) {
      this.wishlistService.removeProductFromWishlist({ productId }).subscribe({
        next: (updatedWishlist:any) => {
          console.log('Vinile rimosso dalla wishlist con successo!');
          this.currentUserWishlistVinyls = updatedWishlist.products;
        },
        error: (error:any) => console.error('Errore nella rimozione dalla wishlist', error)
      });
    } else {
      console.error('ID utente non valido');
    }
  }

  addToCart(vinyl: Vinyl): void {
    console.log('Aggiunta al carrello in corso...');
    const userId = this.authSvc.getCurrentUserId();
    if (!userId) {
      console.error('ID utente non valido');
      return;
    }

    
  }
}
