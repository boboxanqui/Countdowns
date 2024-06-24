import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserData, langOption } from "../../interfaces";
import { MatDialog } from '@angular/material/dialog';
import { AuthDialogComponent } from 'src/app/auth-dialog/auth-dialog.component';
import { AuthService } from 'src/app/service/auth.service';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(
    private translate: TranslateService,
    private dialog: MatDialog,
    private authService: AuthService,
    private auth: Auth
  ) {
    // get lang from localStorage
    this.currentLang = localStorage.getItem('lang') || 'es'
    // NOTE: Default language
    translate.setDefaultLang('es');
    translate.use(this.currentLang);
  }

  ngOnInit(): void {
    if (localStorage.getItem('darkMode') === '1') {
      this.darkMode = true
    } else {
      this.darkMode = false;
    }
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.authService.setUserData(user)
      } else {
        this.authService.removeUserData()
      }
      console.log(this.authService.userData);
    })
  }

  darkMode!: boolean;
  currentLang: string;
  langOptionsOpen: boolean = false;
  userOptionsOpen: boolean = false;
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

  switchTheme(mode: boolean) {
    this.darkModeOn.emit(mode)
    this.darkMode = mode
  }

  get langSelected() {
    return this.langList.find(option => this.currentLang == option.lang)!;
  }

  changeLang(lang: string) {
    this.currentLang = lang;
    this.langOptionsOpen = false;
    this.translate.use(lang)
    localStorage.setItem('lang', lang)
  }

  openAuthDialog(registerDialog: Boolean) {
    this.dialog.open(AuthDialogComponent, {
      data: registerDialog,
      width: '500px',
      panelClass: ['dialog-panel', 'auth-dialog'],
      backdropClass: 'dialog-backdrop',
      // TODO: autoFocus: 'login-input'
    })
  }

  get userData(): UserData {
    return this.authService.userData
  }

  logout() {
    this.authService.logoutUser()
      .then(resp => {
        this.authService.removeUserData();
      })
      .catch(err => console.error(err))
  }

}
