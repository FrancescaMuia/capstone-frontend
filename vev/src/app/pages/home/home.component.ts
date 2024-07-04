import { Component, HostListener } from '@angular/core';
//import { ProductsService } from '../../products.service';
import { AuthService } from '../../auth/auth.service';
import { iProduct } from '../../Models/iproduct';
import { combineLatest } from 'rxjs';
import { VinylService } from '../../vinyls.service';
import { Vinyl } from '../../Models/vinyl';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  /* products: iProduct[] = [];
  productsInOrder: iProduct[] = [];

  categories: string[] = [];
  filteredProducts: iProduct[] = [];
  showFiltered: boolean = false;
  showAlert:boolean = false
  alertMessage:string =''

  searchTerms: string = ''

  isAdmin: boolean = false

  selectedProduct: iProduct | null = null; */

  vinyls: Vinyl[] = [];
  filteredVinyls: Vinyl[] = [];
  showAlert: boolean = false;
  alertMessage: string = '';

  //private productsSvc: ProductsService, 
  constructor(private authSvc: AuthService, private vinylSvc: VinylService) { }

  ngOnInit(): void {

    this.vinylSvc.getAll().subscribe((vinyls: Vinyl[]) => {
      console.log(vinyls);
    })

    this.loadVinyls();

    //this.loadProducts()

  }

  loadVinyls() {
    this.vinylSvc.getAll().subscribe((vinyls: Vinyl[]) => {
      this.vinyls = vinyls; // Salva i vinili nell'array vinyls
      this.filteredVinyls = vinyls;
      console.log('Vinyls loaded:', this.vinyls);
    });
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
  

  /* getArtists(vinyl: Vinyl): string {
    const artists: string[] = [];

    // Map trackIds to observables of tracks
    const trackObservables = vinyl.trackIds.map(trackId => this.vinylSvc.getTrackById(trackId));

    // Combine all track observables into one observable
    combineLatest(trackObservables).subscribe(tracks => {
      tracks.forEach(track => {
        track.artists.forEach(artist => {
          artists.push(artist.name);
        });
      });
    });

    const uniqueArtists = Array.from(new Set(artists));
    return uniqueArtists.join(', ');
  } */

  


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
  /* loadProducts() {

    combineLatest([
      this.productsSvc.getAll(),
      this.authSvc.user$
    ]).subscribe(([allProducts, user]) => {
      this.products = allProducts;
      console.log(this.products);

      //this.isAdmin = !!user && user.admin;

      if (user) {
        const wishlistIds = user.wishlist || [];
        this.products.forEach(product => {
          product.isInWishlist = wishlistIds.includes(product.id);
        });
      }
    });

    

    this.productsSvc.getUniqueCategories().subscribe(categories => {
      this.categories = categories;
    });
  } */

  /* orderByPrice(order: string): void {
    const sourceProducts = this.showFiltered ? this.filteredProducts : this.products;

    this.productsSvc.orderedByPrice(order).subscribe(orderedProducts => {
      const orderedFilteredProducts = orderedProducts.filter(product =>
        sourceProducts.some(p => p.id === product.id)
      );
      if (this.showFiltered) {
        this.filteredProducts = orderedFilteredProducts;
      } else {
        this.products = orderedFilteredProducts;
      }
    });
  } */

  
  /* toggleWishlist(product: iProduct): void {
    const userId = this.authSvc.getCurrentUserId();
    if (!userId) {
      console.error('ID utente non valido');
      return;
    }

    if (product.isInWishlist) {
      this.authSvc.deleteWish(userId, product.id).subscribe({
        next: () => {
          console.log('Prodotto rimosso dalla wishlist con successo!');
          product.isInWishlist = false;
        },
        error: (error) => {
          console.error('Errore nella rimozione dalla wishlist', error);
        }
      });
    } else {
      this.authSvc.addWish(userId, product.id).subscribe({
        next: () => {
          console.log('Prodotto aggiunto alla wishlist con successo!');
          product.isInWishlist = true;
        },
        error: (error) => {
          console.error('Errore nell\'aggiungere alla wishlist', error);
        }
      });
    } */

  }






  /* addToCart(product: iProduct): void {
    console.log('Aggiunta al carrello in corso...');

    const userId = this.authSvc.getCurrentUserId();
    if (!userId) {
      console.error('ID utente non valido');
      return;
    }

    this.authSvc.addCart(userId, product.id).subscribe({
      next: () => {
        console.log('Prodotto aggiunto al carrello con successo!');
        this.alertMessage = product.name + ' aggiunto al carrello!'
        this.showAlert = true;
          setTimeout(() => {
            this.showAlert = false;
          }, 2000);
      },
      error: (error) => {
        console.error('Errore nell\'aggiungere al carrello', error);

      }
    });
  } */



/*   filterByCategory(category: string): void {
  this.productsSvc.getProductsByCategory(category).subscribe(filteredProducts => {
    this.products = filteredProducts;
  });
}

showAllProducts(): void {
  this.productsSvc.getAll().subscribe(allProducts => {
    this.products = allProducts;
  });
}

showSearch(event: any): void {
  const searchTerm = event?.target.value.trim().toLowerCase();
  if (searchTerm !== '') {
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    );
    this.showFiltered = true;
  } else {
    this.filteredProducts = [...this.products];

    this.showFiltered = false;
  }
  
}

openProductModal(product: iProduct): void {
  this.selectedProduct = product;
}

closeProductModal(): void {
  this.selectedProduct = null;
}


} */
