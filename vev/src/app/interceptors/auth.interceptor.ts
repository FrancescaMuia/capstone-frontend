import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private authSvc: AuthService, private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Aggiungi token JWT se presente
    const authToken = this.authSvc.getToken();
    if (authToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error instanceof ErrorEvent) {
          // Errore del client, ad esempio una rete disconnessa
          console.error('Errore client:', error.error.message);
        } else {
          // Errore lato server
          console.error(`Errore dal server: ${error.status}, ` + `messaggio: ${error.message}`);
        }

        // Gestione specifica degli errori
        if (error.status === 401) {
          // Esempio: gestione logout automatico se token scaduto
          this.authSvc.logout();
          // Reindirizzamento a pagina di login o pagina di errore
          this.router.navigate(['/auth/login']);
        }

        // Reindirizza l'errore per propagarlo all'observer superiore
        return throwError(error);
      })
    );
  }
}
