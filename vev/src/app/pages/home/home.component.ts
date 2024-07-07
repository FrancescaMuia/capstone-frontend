import { Component, HostListener } from '@angular/core';
//import { ProductsService } from '../../products.service';
import { AuthService } from '../../auth/auth.service';
import { iProduct } from '../../Models/iproduct';
import { combineLatest } from 'rxjs';
import { VinylService } from '../../vinyls.service';
import { Vinyl } from '../../Models/vinyl';
import { Router } from '@angular/router';
import { WishlistService } from '../../wishlist.service';


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
  constructor(private authSvc: AuthService, private vinylSvc: VinylService, private router: Router, private wishlistService: WishlistService,) { }

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

  /* toggleWishlist(vinyl: Vinyl): void {
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
  } */

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
          if (!isLoggedIn) {
            this.router.navigate(['/auth/login']);
          }
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
