import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewCountdownComponent } from './new-countdown/new-countdown.component';
import { CountdownService } from './service/countdown.service';
import { AuthService } from './service/auth.service';
import { Unsubscribable, every, filter, map, mergeMap, sampleTime, switchMap, tap } from 'rxjs';
import { AuthDialogComponent } from './auth-dialog/auth-dialog.component';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

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
    private authService: AuthService,
    private auth: Auth
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem('darkMode') === '1') {
      this.renderer.setAttribute(this.document.body, 'class', 'dark-theme')
    } else {
      this.renderer.setAttribute(this.document.body, 'class', 'light-theme')
    }

    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.unsubscribe = this.countdownService.getCollection(user.uid).subscribe(
          resp => {
            if (resp.length > 0) {
              this.countdownService.setCountdowns(
                resp.map(countdown => {
                  return {
                    caption: countdown.caption,
                    creationDate: new Date(countdown.creationDate.seconds * 1000),
                    date: new Date(countdown.date.seconds * 1000),
                    id: Number(countdown.id),
                    name: countdown.name,
                    closed: countdown.closed,
                    removed: countdown.removed,

                  }
                })
              )
            } else if (resp.length === 0 && this.countdowns.length === 1) {
              this.countdownService.addCountdown(this.countdowns[0])
            }
            //FIXME: delete log
            console.table(resp);
          });
      } else {
        if (this.unsubscribe) {
          this.unsubscribe.unsubscribe()
        }
        // TODO: get countdowns from Local Storage
        this.countdownService.setCountdowns([])
      }
      clearInterval(this.timer)
      this.startTimer()
    })
  }

  timer: any;
  loginToCreate: boolean = false;
  activeUser: boolean = false;
  unsubscribe: Unsubscribable | undefined

  // THEME TOGGLE
  switchTheme(isDark: boolean) {
    const theme = isDark ? 'dark-theme' : 'light-theme'
    this.renderer.setAttribute(this.document.body, 'class', theme)
    localStorage.setItem('darkMode', isDark === true ? '1' : '0')
  }

  // NEW COUNTDOWN
  openNewCountdownForm() {
    if (!this.authService.currentUser() && this.countdowns.length >= 1) {
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
    return this.countdownService.countdowns.filter( countdown => 
      !countdown.closed && !countdown.removed
    )
  }

  startTimer() {
    const now = new Date()
    this.countdowns
      .filter(countdown => countdown.date < now)
      .forEach(countdown => countdown.timeLeft = 0);
    this.countdowns
      .filter(countdown => countdown.date > now)
      .forEach(countdown =>
        countdown.timeLeft = countdown.date.getTime() - now.getTime()
      )
    this.timer = setInterval(() => {
      const now = new Date()
      this.countdowns
        .filter(countdown => countdown.date < now)
        .forEach(countdown => countdown.timeLeft = 0);
      this.countdowns
        .filter(countdown => countdown.date > now)
        .forEach(countdown => {
          countdown.timeLeft = countdown.date.getTime() - now.getTime();
        });
    }, 1000)
  }

  // LOGIN GUARD
  get activeUser$() {
    return this.authService.activeUser$
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

  get userData() {
    return this.authService.userData
  }

}