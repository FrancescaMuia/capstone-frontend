import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vinyl } from './Models/vinyl';
import { Iwine } from './Models/iwine';
import { SimpleWine } from './Models/simplewine';

@Injectable({
  providedIn: 'root'
})
export class VinylWineAssociationService {
  private baseUrl = 'http://localhost:8080/api/vinyl/associate';

  constructor(private http: HttpClient) { }

  associateVinylAndWine(vinylId: number, wineId: number): Observable<void> {
    const url = `${this.baseUrl}/associate`;
    return this.http.put<void>(url, { vinylId, wineId });
  }

  getVinyls(): Observable<Vinyl[]> {
    return this.http.get<Vinyl[]>(`${this.baseUrl}/vinyls`);
  }

  getWines(): Observable<SimpleWine[]> {
    return this.http.get<SimpleWine[]>(`${this.baseUrl}/wines`);
  }
}



