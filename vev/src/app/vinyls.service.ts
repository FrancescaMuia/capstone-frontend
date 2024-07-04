import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environments/environment.development';
import { Vinyl } from './Models/vinyl';

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
}
