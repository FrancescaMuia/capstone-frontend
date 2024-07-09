import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environments/environment.development';
import { Iwine, IwineWithId } from './Models/iwine';

@Injectable({
  providedIn: 'root'
})
export class WineService {

  private winesUrl = environment.winesUrl;
  private winesSubject = new BehaviorSubject<Iwine[]>([]);
  public $wines = this.winesSubject.asObservable();

  constructor(private http: HttpClient) { }

  getAll(): Observable<IwineWithId[]>{
    return this.http.get<IwineWithId[]>(this.winesUrl);
  }

  getVinylById(id: number): Observable<Iwine> {
    const url = `${this.winesUrl}/${id}`;
    return this.http.get<Iwine>(url);
  }

  saveWine(wine: Iwine): Observable<Iwine> {
    return this.http.post<Iwine>(this.winesUrl, wine);
  }

  updateWine(id: number, wine: Iwine): Observable<Iwine> {
    const url = `${this.winesUrl}/${id}`;
    return this.http.put<Iwine>(url, wine);
  }

  patchWine(id: number, wine: Partial<Iwine>): Observable<Iwine> {
    const url = `${this.winesUrl}/${id}`;
    return this.http.patch<Iwine>(url, wine);
  }

  deleteWine(id: number): Observable<void> {
    const url = `${this.winesUrl}/${id}`;
    return this.http.delete<void>(url);
  }

  addWine(wine: Iwine): Observable<Iwine> {
    return this.http.post<Iwine>(this.winesUrl, wine);
  }

  uploadWineImage(id: number, formData: FormData): Observable<string> {
    const url = `${this.winesUrl}/${id}/upload-image`;
    return this.http.post<string>(url, formData);
  }
}
