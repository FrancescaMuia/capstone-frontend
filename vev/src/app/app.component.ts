import { Component, HostListener } from '@angular/core';
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
    this.updateBackgroundPosition();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isHomePage = (event.urlAfterRedirects === '/' || event.urlAfterRedirects === '/home');
      }
    });

  }

  @HostListener('window:scroll', [])
onWindowScroll() {
  const presentationElement = document.querySelector('.presentation') as HTMLElement;
  if (presentationElement) {
    const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const bgPositionY = scrollTop * 0.5; // Velocità dello sfondo
    presentationElement.style.backgroundPosition = `center -${bgPositionY}px`;
  }
}

updateBackgroundPosition() {
  const presentationElement = document.querySelector('.presentation') as HTMLElement;
  if (presentationElement) {
    const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const bgPositionY = scrollTop * 0.5;
    presentationElement.style.backgroundPosition = `center -${bgPositionY}px`;
  }
}

}
