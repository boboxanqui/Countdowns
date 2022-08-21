import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { langOption } from "../../interfaces";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor( ) {}

  ngOnInit(): void {
    if( localStorage.getItem('darkMode') === '1' ){
      this.checked = true
    } else {
      this.checked = false;
    }
  }

  checked!: boolean;
  currentLang: string = 'es';
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

  switchTheme( checked: boolean ){
    this.darkModeOn.emit(checked)
    this.checked = checked
  }

  get langSelected() {
    return this.langList.find( option => this.currentLang == option.lang )!;
  }

  changeLang( lang: string){
    this.currentLang = lang;
    this.langOptionsOpen = false;
  }

}
