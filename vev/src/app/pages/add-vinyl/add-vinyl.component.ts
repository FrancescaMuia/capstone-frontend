
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { VinylService } from '../../vinyls.service';
import { Vinyl } from '../../Models/vinyl';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-vinyl',
  templateUrl: './add-vinyl.component.html',
  styleUrls: ['./add-vinyl.component.scss']
})
export class AddVinylComponent {

  vinyl: Vinyl = {
    name: '',
    price: 0,
    available: true,
    year: 0,
    trackIds: [],
    coverImg: '',
    genre: '',
    recommendedWines: []
  };

  selectedFile: File | null = null;

  constructor(
    private vinylService: VinylService,
    private router: Router
  ) { }

  saveVinyl(): void {
    // Invia il vinile senza l'immagine per ora
    this.vinylService.saveVinyl(this.vinyl).subscribe({
      next: (savedVinyl) => {
        console.log('Nuovo vinile aggiunto con successo:', savedVinyl);
        this.router.navigate(['/products']);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Errore durante l\'aggiunta del vinile:', err);
      }
    });

    // Se è stato selezionato un file, carica anche l'immagine
    if (this.selectedFile) {
      this.uploadImage(this.selectedFile);
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    this.selectedFile = file;
  }

  uploadImage(file: File): void {
    const formData = new FormData();
    formData.append('file', file, file.name);

    // Chiamata HTTP per caricare l'immagine
    this.vinylService.uploadImage(formData).subscribe({
      next: (imageUrl) => {
        console.log('Immagine caricata con successo:', imageUrl);
        this.vinyl.coverImg = imageUrl; // Aggiorna il percorso dell'immagine nel vinile
      },
      error: (err: HttpErrorResponse) => {
        console.error('Errore durante il caricamento dell\'immagine:', err);
      }
    });
  }
  

}
