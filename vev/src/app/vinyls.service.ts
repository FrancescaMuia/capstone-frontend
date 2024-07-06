import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environments/environment.development';
import { Vinyl } from './Models/vinyl';
import { SimpleWine } from './Models/simplewine';

@Injectable({
  providedIn: 'root'
})
export class VinylService {

  private vinylsUrl = environment.vinylsUrl;
  private vinylsSubject = new BehaviorSubject<Vinyl[]>([]);
  public $vinyls = this.vinylsSubject.asObservable();

  constructor(private http: HttpClient) { }

  getAll(): Observable<Vinyl[]>{
    return this.http.get<Vinyl[]>(this.vinylsUrl);
  }
  
  getVinylById(id: number): Observable<Vinyl> {
    const url = `${this.vinylsUrl}/${id}`;
    return this.http.get<Vinyl>(url);
  }

  saveVinyl(vinyl: Vinyl): Observable<Vinyl> {
    return this.http.post<Vinyl>(this.vinylsUrl, vinyl);
  }

  updateVinyl(id: number, vinyl: Vinyl): Observable<Vinyl> {
    const url = `${this.vinylsUrl}/${id}`;
    return this.http.put<Vinyl>(url, vinyl);
  }

  patchVinyl(id: number, vinyl: Partial<Vinyl>): Observable<Vinyl> {
    const url = `${this.vinylsUrl}/${id}`;
    return this.http.patch<Vinyl>(url, vinyl);
  }

  deleteVinyl(id: number): Observable<void> {
    const url = `${this.vinylsUrl}/${id}`;
    return this.http.delete<void>(url);
  }

  addVinyl(vinyl: Vinyl): Observable<Vinyl> {
    return this.http.post<Vinyl>(this.vinylsUrl, vinyl);
  }

  // Metodo per caricare un'immagine
  uploadImage(formData: FormData): Observable<string> {
    return this.http.post<string>(`${this.vinylsUrl}/upload-image`, formData);
  }
  

  //prova per caricare su cloudinary
  /* uploadVinylImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default'); // Sostituisci con il tuo upload preset di Cloudinary

    return this.http.post('https://api.cloudinary.com/v1_1/dtfpc1ez0/image/upload', formData);
  } */

  uploadPoster(id: number, file: File): Observable<Vinyl> {
    const formData = new FormData();
    formData.append('poster', file);
    return this.http.patch<Vinyl>(`${this.vinylsUrl}/${id}/productImg`, formData);
  }


}
