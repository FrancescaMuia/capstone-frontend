import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { iUser } from '../../Models/iuser';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  registerData: Partial<iUser> = {};
  errorMessage: string | null = null;

  constructor(
    private authSvc: AuthService,
    private router: Router
  ) { }

  //signUp(): void {
   // this.authSvc.register(this.registerData)
   //   .subscribe(data => {
   //     this.router.navigate(['/']);
   //   });
  //}
  signUp(): void {
    this.authSvc.register(this.registerData)
      .subscribe({
        next: data => {
          this.router.navigate(['/']);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 409) {
            this.errorMessage = "Utente già esistente";
          } else {
            this.errorMessage = "Errore durante la registrazione. Riprova più tardi.";
          }
        }
      });
  }
}
