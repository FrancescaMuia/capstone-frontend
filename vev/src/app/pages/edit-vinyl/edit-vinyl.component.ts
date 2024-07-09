import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VinylService } from '../../vinyls.service';
import { Vinyl } from '../../Models/vinyl';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Iwine, IwineWithId } from '../../Models/iwine';
import { WineService } from '../../wine.service';

@Component({
  selector: 'app-edit-vinyl',
  templateUrl: './edit-vinyl.component.html',
  styleUrls: ['./edit-vinyl.component.scss']
})
export class EditVinylComponent implements OnInit {

  vinyl: Vinyl | undefined;
  wines: IwineWithId[] | undefined;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  selectedWineIds: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private vinylService: VinylService,
    private router: Router,
    private http: HttpClient,
    private wineService: WineService
  ) { }

  ngOnInit(): void {
    this.getVinyl();
    this.loadWines();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  getVinyl(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.vinylService.getVinylById(id).subscribe({
      next: (vinyl: Vinyl) => {
        this.vinyl = vinyl;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Errore durante il caricamento del vinile:', error);
      }
    });
  }

  loadWines() {
    
     this.wineService.getAll().subscribe((wines: IwineWithId[]) => {
        this.wines = wines;
        
        console.log('Wines loaded:', this.wines);
      });
    };
  

  /* saveVinyl(): void {
    if (this.vinyl && this.vinyl.id) { // Assicurati che vinyl e vinyl.id siano definiti
      if (this.selectedFile) {
        this.vinylService.updateVinylWithImage(this.vinyl.id, this.vinyl, this.selectedFile).subscribe(
          () => {
            console.log('Vinile e immagine aggiornati con successo');
            this.router.navigate(['/products']);
          },
          (error: HttpErrorResponse) => {
            console.error('Errore durante l\'aggiornamento del vinile e dell\'immagine:', error);
          }
        );
      } else {
        this.vinylService.updateVinyl(this.vinyl.id, this.vinyl).subscribe(
          () => {
            console.log('Vinile aggiornato con successo');
            this.router.navigate(['/products']);
          },
          (error: HttpErrorResponse) => {
            console.error('Errore durante l\'aggiornamento del vinile:', error);
          }
        );
      }
    } else {
      console.error('ID del vinile non definito o vinile non valido.');
    }
  } */

    saveVinyl(): void {
      if (this.vinyl && this.vinyl.id) {
        this.vinyl.recommendedWineIds = this.selectedWineIds;
        if (this.selectedFile) {
          this.vinylService.updateVinylWithImage(this.vinyl.id, this.vinyl, this.selectedFile).subscribe(
            () => {
              console.log('Vinile e immagine aggiornati con successo');
              this.router.navigate(['/products']);
            },
            (error: HttpErrorResponse) => {
              console.error('Errore durante l\'aggiornamento del vinile e dell\'immagine:', error);
            }
          );
        } else {
          this.vinylService.updateVinyl(this.vinyl.id, this.vinyl).subscribe(
            () => {
              console.log('Vinile aggiornato con successo');
              this.router.navigate(['/products']);
            },
            (error: HttpErrorResponse) => {
              console.error('Errore durante l\'aggiornamento del vinile:', error);
            }
          );
        }
      } else {
        console.error('ID del vinile non definito o vinile non valido.');
      }
    }

  deleteVinyl(vinylId: number): void {
    if (confirm("Sei sicuro di voler eliminare questo vinile?")) {
      this.vinylService.deleteVinyl(vinylId).subscribe({
        next: () => {
          console.log('Vinile eliminato con successo');
          this.router.navigate(['/products']);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Errore durante l\'eliminazione del vinile:', err);
        }
      });
    }
  }

  onWineSelectionChange(wineId: number, event: any): void {
    if (event.target.checked) {
      this.selectedWineIds.push(wineId);
    } else {
      this.selectedWineIds = this.selectedWineIds.filter(id => id !== wineId);
    }
  }
}
