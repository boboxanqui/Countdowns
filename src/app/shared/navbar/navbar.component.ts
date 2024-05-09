import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { TranslateService } from '@ngx-translate/core';
import { langOption } from "../../interfaces";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor( private translate: TranslateService ) {
    // get lang from localStorage
    this.currentLang = localStorage.getItem('lang') || 'es'
    // NOTE: Default language
    translate.setDefaultLang('es');
    translate.use(this.currentLang);
  }

  ngOnInit(): void {
    if( localStorage.getItem('darkMode') === '1' ){
      this.darkMode = true
    } else {
      this.darkMode = false;
    }
  }

  darkMode!: boolean;
  currentLang: string;
  langOptionsOpen: boolean = false;
  langList: langOption[] = [
    {
      lang: 'es',
      name: 'Español',
      flag: '../../../assets/flags/spain-flag-80x53.webp'
    },
    {
       lang: 'en',
       name: 'English',
       flag: '../../../assets/flags/uk-flag-100x50.webp'
    }
  ]


  @Output() darkModeOn = new EventEmitter<boolean>()

  switchTheme( mode: boolean ){
    this.darkModeOn.emit(mode)
    this.darkMode = mode
  }

  get langSelected() {
    return this.langList.find( option => this.currentLang == option.lang )!;
  }

  changeLang( lang: string){
    this.currentLang = lang;
    this.langOptionsOpen = false;
    this.translate.use(lang)
    localStorage.setItem('lang',lang)
  }

}
