import { JwtHelperService } from '@auth0/angular-jwt';
import { Injectable } from '@angular/core';
import { iUser } from '../Models/iuser';
import { BehaviorSubject, Observable, catchError, map, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';
import { iLoginData } from '../Models/ilogindata';

type AccessData = {
  token: string,
  user: iUser
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  jwtHelper: JwtHelperService = new JwtHelperService();
  private token: string | null = null;

  authSubject = new BehaviorSubject<iUser | null>(null);
  user$ = this.authSubject.asObservable();

  isLoggedIn$ = this.user$.pipe(
    map(user => !!user),
    tap(user => this.syncIsLoggedIn = user)
  );

  syncIsLoggedIn: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.restoreUser();
  }

  registerUrl: string = environment.registerUrl;
  loginUrl: string = environment.loginUrl;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('authToken');
    }
    return this.token;
  }

  register(newUser: Partial<iUser>): Observable<AccessData> {
    return this.http.post<AccessData>(this.registerUrl, newUser).pipe(
      tap(data => {
        this.authSubject.next(data.user);
        this.storeUserData(data.token, data.user);
      }),
      catchError(error => {
        console.error('Registration error:', error);
        throw this.errors(error);
      })
    );
  }

  login(loginData: iLoginData, rememberMe: boolean): Observable<AccessData> {
    return this.http.post<AccessData>(this.loginUrl, loginData).pipe(
      tap(data => {
        this.authSubject.next(data.user);
        this.setToken(data.token);
        if (rememberMe) {
          localStorage.setItem('accessData', JSON.stringify(data));
        } else {
          sessionStorage.setItem('accessData', JSON.stringify(data));
        }
        this.autoLogout(data.token);
      }),
      catchError(error => {
        throw error;
      })
    );
  }

  logout() {
    this.authSubject.next(null);
    localStorage.removeItem('accessData');
    sessionStorage.removeItem('accessData');
    localStorage.removeItem('authToken');
    this.router.navigate(['/auth/login']);
  }

  autoLogout(jwt: string) {
    const expDate = this.jwtHelper.getTokenExpirationDate(jwt) as Date;
    const expMs = expDate.getTime() - new Date().getTime();
    setTimeout(() => {
      this.logout();
    }, expMs);
  }

  restoreUser() {
    let userJson = localStorage.getItem('accessData') || sessionStorage.getItem('accessData');
    if (!userJson) return;

    const accessData: AccessData = JSON.parse(userJson);
    if (this.jwtHelper.isTokenExpired(accessData.token)) return;

    this.authSubject.next(accessData.user);
    this.setToken(accessData.token);
    this.autoLogout(accessData.token);
  }

  getCurrentUserId(): number | null {
    const currentUser = this.authSubject.value;
    return currentUser ? currentUser.id ?? null : null;
  }

  isAdmin(): Observable<boolean> {
    return this.user$.pipe(
      map(user => !!user && (user.roles?.some(role => role.roleType === 'ADMIN') ?? false))
    );
  }

  private storeUserData(token: string, user: iUser): void {
    localStorage.setItem('accessData', JSON.stringify({ token, user }));
  }

  addWish(userId: number, productId: number): Observable<any> {
    const url = `${environment.usersUrl}/${userId}`;
    return this.http.get<any>(url).pipe(
      tap(user => {
        const wishlist = Array.isArray(user.wishlist) ? user.wishlist : [];
        if (!wishlist.includes(productId)) {
          const updatedwishlist = [...wishlist, productId];
          const updatedUser = { ...user, wishlist: updatedwishlist };
          this.http.patch<any>(url, { wishlist: updatedwishlist }).subscribe(() => {
            this.authSubject.next(updatedUser);
          });
        }
      })
    );
  }

  deleteWish(userId: number, productId: number): Observable<any> {
    const url = `${environment.usersUrl}/${userId}`;
    return this.http.get<any>(url).pipe(
      tap(user => {
        const wishlist = Array.isArray(user.wishlist) ? user.wishlist : [];
        if (wishlist.includes(productId)) {
          const updatedwishlist = wishlist.filter((id: number) => id !== productId);
          const updatedUser = { ...user, wishlist: updatedwishlist };
          this.http.patch<any>(url, { wishlist: updatedwishlist }).subscribe(() => {
            this.authSubject.next(updatedUser);
          });
        }
      })
    );
  }

  addCart(userId: number, productId: number): Observable<any> {
    const url = `${environment.usersUrl}/${userId}`;
    return this.http.get<any>(url).pipe(
      switchMap(user => {
        const cart = Array.isArray(user.cart) ? user.cart : [];
        const updatedCart = [...cart, productId];
        const updatedUser = { ...user, cart: updatedCart };
        return this.http.patch<any>(url, { cart: updatedCart }).pipe(
          tap(() => this.authSubject.next(updatedUser)),
          catchError(err => {
            console.error('Failed to add to cart', err);
            throw err;
          })
        );
      }),
      catchError(err => {
        console.error('Failed to retrieve user', err);
        throw err;
      })
    );
  }

  deleteCart(userId: number, productId: number): Observable<any> {
    const url = `${environment.usersUrl}/${userId}`;
    return this.http.get<any>(url).pipe(
      tap(user => {
        console.log('User before cart update:', user);
        const cart = Array.isArray(user.cart) ? user.cart : [];
        let removed = false;

        const updatedCart = cart.reduce((acc:any, curId:any) => {
          if (curId === productId && !removed) {
            removed = true;
            return acc;
          } else {
            acc.push(curId);
            return acc;
          }
        }, []);

        if (removed) {
          const updatedUser = { ...user, cart: updatedCart };
          console.log('Updated user with cart:', updatedUser);
          this.http.patch<any>(url, { cart: updatedCart }).subscribe(() => {
            console.log('User updated successfully');
            this.authSubject.next(updatedUser);
          });
        }
      })
    );
}

  emptyCart(userId: number): Observable<any> {
    const url = `${environment.usersUrl}/${userId}`;
    return this.http.get<any>(url).pipe(
      tap(user => {
        const updatedCart:number[] = [];
        const updatedUser = { ...user, cart: updatedCart };
        this.http.patch<any>(url, { cart: updatedCart }).subscribe(() => {
          this.authSubject.next(updatedUser);
        });
      })
    );
  }


  countProductInCart(productId: number): Observable<number> {
    return this.user$.pipe(
      map(user => {
        if (!user || !user.cart) {
          return 0;
        }
        return user.cart.filter(id => id === productId).length;
      })
    );
  }


  errors(err: any) {
    console.log('Error received:', err);
    if (err.error && err.error.message) {
      switch (err.error.message) {
        case "Utente gia' esistente":
          return new Error('Username già esistente');
        case "Email gia' registrata":
          return new Error('Email già registrata');
        case "Email and Password are required":
          return new Error('Email e password obbligatorie');
        case "Email format is invalid":
          return new Error('Email scritta male');
        case "Invalid credentials":
          return new Error('Credenziali non valide');
        default:
          return new Error(err.error.message);
      }
    }
    if (err.error && err.error.errors) {
      return new Error(err.error.errors.join(', '));
    }
    return new Error(`Qualcosa è andato storto! Dettagli: ${err.message}`);
  }

  setDesiredAction(actionData: { action: string, vinylId: number }): void {
    sessionStorage.setItem('desiredAction', JSON.stringify(actionData));
  }
}
