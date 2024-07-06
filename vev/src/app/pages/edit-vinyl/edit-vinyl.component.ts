import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VinylService } from '../../vinyls.service';
import { Vinyl } from '../../Models/vinyl';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-edit-vinyl',
  templateUrl: './edit-vinyl.component.html',
  styleUrls: ['./edit-vinyl.component.scss']
})
export class EditVinylComponent implements OnInit {

  vinyl: Vinyl | undefined;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  constructor(
    private route: ActivatedRoute,
    private vinylService: VinylService,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.getVinyl();
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

  saveVinyl(): void {
    if (this.vinyl && this.vinyl.id) { // Assicurati che vinyl e vinyl.id siano definiti
      this.vinylService.updateVinyl(this.vinyl.id, this.vinyl).subscribe(() => {
        console.log('Vinile aggiornato con successo');
        this.router.navigate(['/products']);
      }, (error: HttpErrorResponse) => {
        console.error('Errore durante l\'aggiornamento del vinile:', error);
      });
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


  
}

