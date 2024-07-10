import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'vev';

  isHomePage: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isHomePage = (event.urlAfterRedirects === '/' || event.urlAfterRedirects === '/home');
      }
    });
  }
}
