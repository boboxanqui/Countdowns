import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewCountdownComponent } from './new-countdown/new-countdown.component';
import { CountdownService } from './service/countdown.service';
import { AuthService } from './service/auth.service';
import { map } from 'rxjs';
import { AuthDialogComponent } from './auth-dialog/auth-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private dialog: MatDialog,
    private countdownService: CountdownService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem('darkMode') === '1') {
      this.renderer.setAttribute(this.document.body, 'class', 'dark-theme')
    } else {
      this.renderer.setAttribute(this.document.body, 'class', 'light-theme')
    }

    this.countdowns.forEach(countdown =>
      countdown.timeLeft = countdown.date.getTime() - new Date().getTime()
    )

    this.startTimer()

    this.authService.activeUser$.subscribe( resp =>{
      this.loginToCreate = false
      console.info('Active User: ' + resp);
    })

  }

  timer: any;
  loginToCreate: boolean = false;
  activeUser: boolean = false;

  // THEME TOGGLE
  switchTheme(isDark: boolean) {
    const theme = isDark ? 'dark-theme' : 'light-theme'
    this.renderer.setAttribute(this.document.body, 'class', theme)
    localStorage.setItem('darkMode', isDark === true ? '1' : '0')
  }

  // NEW COUNTDOWN
  openNewCountdownForm() {

    // TODO: Guard login
    if (!this.authService.currentUser() && this.countdowns.length > 1) {
      this.loginToCreate = true;
    } else {
      this.dialog.open(NewCountdownComponent, {
        width: '800px',
        panelClass: 'dialog-panel',
        backdropClass: 'dialog-backdrop',
        autoFocus: 'name-input'
      })
    }
  }

  // COUNTDOWNS LOGIC
  get countdowns() {
    return this.countdownService.countdowns
  }

  startTimer() {
    this.timer = setInterval(() => {
      const now = new Date()
      this.countdowns.forEach(countdown =>
        countdown.timeLeft = countdown.date.getTime() - now.getTime()
      )
    }, 1000)
  }

  // LOGIN GUARD
  get activeUser$(){
    return this.authService.activeUser$
  }

  openAuthDialog(registerDialog: Boolean){
    this.dialog.open( AuthDialogComponent, {
      data: registerDialog,
      width: '500px',
      panelClass: ['dialog-panel','auth-dialog'],
      backdropClass: 'dialog-backdrop',
      // TODO: autoFocus: 'login-input'
    })
  }

}