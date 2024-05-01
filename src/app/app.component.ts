import { DOCUMENT } from '@angular/common';
import { Component, HostBinding, Inject, OnInit, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewCountdownComponent } from './new-countdown/new-countdown.component';
import { CountdownService } from './service/countdown.service';

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
    private countdownService: CountdownService
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem('darkMode') === '1') {
      this.renderer.setAttribute(this.document.body, 'class', 'dark-theme')
    } else {
      this.renderer.setAttribute(this.document.body, 'class', 'light-theme')
    }
  }

  switchTheme(isDark: boolean) {
    const theme = isDark ? 'dark-theme' : 'light-theme'
    this.renderer.setAttribute(this.document.body, 'class', theme)
    localStorage.setItem('darkMode', isDark === true ? '1' : '0')
  }

  openNewCountdownForm() {
    this.dialog.open(NewCountdownComponent, {
      width: '800px',
      panelClass: 'dialog-panel'
    })
  }

  get countdowns() {
    return this.countdownService.countdowns
  }

}
