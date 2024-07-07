import { Component } from '@angular/core';
import { WineService } from '../../wine.service';
import { Router } from '@angular/router';
import { Iwine } from '../../Models/iwine';

@Component({
  selector: 'app-add-wine',
  templateUrl: './add-wine.component.html',
  styleUrls: ['./add-wine.component.scss']
})
export class AddWineComponent {
  wine: Iwine = {
    variety: '',
    producer: '',
    description: '',
    price: 0,
    recommendedVinylId: []
  };

  constructor(
    private wineService: WineService,
    private router: Router
  ) { }

  saveWine(): void {
    this.wineService.addWine(this.wine).subscribe({
      next: () => {
        console.log('Nuovo vino aggiunto con successo');
        this.router.navigate(['/products']); // Naviga verso la pagina dei prodotti
      },
      error: (err) => console.error('Errore durante l\'aggiunta del nuovo vino:', err)
    });
  }
}

