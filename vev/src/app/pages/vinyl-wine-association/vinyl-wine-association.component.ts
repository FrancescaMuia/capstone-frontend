import { Component, OnInit } from '@angular/core';
import { VinylWineAssociationService } from '../../vinyl-wine-association.service';
import { Vinyl } from '../../Models/vinyl';
import { Iwine } from '../../Models/iwine';
import { SimpleWine } from '../../Models/simplewine';

@Component({
  selector: 'app-vinyl-wine-association',
  templateUrl: './vinyl-wine-association.component.html',
  styleUrls: ['./vinyl-wine-association.component.scss']
})
export class VinylWineAssociationComponent implements OnInit {
  vinyls: Vinyl[] = [];
  wines: SimpleWine[] = [];
  selectedVinylId: number | null = null;
  selectedWineId: number | null = null;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private associationService: VinylWineAssociationService) { }

  ngOnInit(): void {
    this.loadVinyls();
    this.loadWines();
  }

  loadVinyls(): void {
    this.associationService.getVinyls().subscribe({
      next: (vinyls) => this.vinyls = vinyls,
      error: (error) => console.error('Error loading vinyls:', error)
    });
  }

  loadWines(): void {
    this.associationService.getWines().subscribe({
      next: (wines) => this.wines = wines,
      error: (error) => console.error('Error loading wines:', error)
    });
  }

  associateVinylAndWine(): void {
    if (this.selectedVinylId !== null && this.selectedWineId !== null) {
      this.associationService.associateVinylAndWine(this.selectedVinylId, this.selectedWineId).subscribe({
        next: () => {
          this.successMessage = 'Vinile e vino associati con successo!';
          this.errorMessage = null;
        },
        error: (error) => {
          this.errorMessage = 'Errore nell\'associare vinile e vino.';
          this.successMessage = null;
          console.error('Error associating vinyl and wine:', error);
        }
      });
    } else {
      this.errorMessage = 'Per favore, seleziona sia un vinile che un vino.';
      this.successMessage = null;
    }
  }
}

