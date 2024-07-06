import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { WineService } from '../../wine.service';
import { Iwine } from '../../Models/iwine';
import { iUser, Role } from '../../Models/iuser';

@Component({
  selector: 'app-wine-list',
  templateUrl: './winelist.component.html',
  styleUrls: ['./winelist.component.scss']
})
export class WineListComponent implements OnInit {

  wines: Iwine[] = [];
  filteredWines: Iwine[] = [];
  showAlert: boolean = false;
  alertMessage: string = '';

  showModal: boolean = false;
  selectedWine: Iwine | null = null;
  isAdmin: boolean = false;
  currentUser: iUser | null = null;

  constructor(private authSvc: AuthService, private wineSvc: WineService) { }

  ngOnInit(): void {
    this.loadWines();
  }

  loadWines() {
    this.authSvc.user$.subscribe((user: iUser | null) => {
      console.log('User data:', user);
      if (user) {
        this.isAdmin = !!user.roles && user.roles.some(role => role.roleType === 'ADMIN');
      } else {
        this.isAdmin = false;
      }

      this.wineSvc.getAll().subscribe((wines: Iwine[]) => {
        this.wines = wines;
        this.filteredWines = wines;
        console.log('Wines loaded:', this.wines);
      });
    });
  }

  openModal(wine: Iwine): void {
    this.selectedWine = wine;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  addToCart(wine: Iwine): void {
    console.log('Aggiunta al carrello in corso...');

    const userId = this.authSvc.getCurrentUserId();
    if (!userId) {
      console.error('ID utente non valido');
      return;
    }

    // Implementa la logica per aggiungere il vino al carrello
  }

  toggleWishlist(wine: Iwine): void {
    const userId = this.authSvc.getCurrentUserId();
    if (!userId) {
      console.error('ID utente non valido');
      return;
    }

    // Implementa la logica per aggiungere/rimuovere il vino dalla wishlist
  }

  showSearch(event: any): void {
    const searchTerm = event?.target.value.trim().toLowerCase();
    if (searchTerm !== '') {
      this.filteredWines = this.wines.filter(wine =>
        wine.variety.toLowerCase().includes(searchTerm) ||
        wine.producer.toLowerCase().includes(searchTerm) ||
        wine.description.toLowerCase().includes(searchTerm)
      );
    } else {
      this.filteredWines = [...this.wines];
    }
  }
}

