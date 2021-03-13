import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private linkTheme = document.querySelector('#theme');
  //public linkTheme = document.querySelector('#theme');
  //public links: NodeListOf<Element>;

  constructor() {
    //console.log('Console.log -> Desde -> settings.service.ts -> Settings Service init');
    const url = localStorage.getItem('theme') || './assets/css/colors/megna.css';
    this.linkTheme.setAttribute('href', url);
  }

  // Método para cambiar el tema
  changeTheme(theme: string) {
    const url = `./assets/css/colors/${theme}.css`;
    this.linkTheme.setAttribute('href', url);
    localStorage.setItem('theme', url);
    this.checkCurrentTheme();
  }


  checkCurrentTheme() {
    //console.log('link actual: ', this.links);
    const links = document.querySelectorAll('.selector');
    links.forEach(elemento => {
      elemento.classList.remove('working');
      const btnTheme = elemento.getAttribute('data-theme');
      const btnThemeUrl = `./assets/css/colors/${btnTheme}.css`;
      const currentTheme = this.linkTheme.getAttribute('href');

      if (btnThemeUrl === currentTheme) {
        elemento.classList.add('working');
      }

    });
  }
}
