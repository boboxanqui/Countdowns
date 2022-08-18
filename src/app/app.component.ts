import { DOCUMENT } from '@angular/common';
import { Component, HostBinding, Inject, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor( 
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2  
  ){}

  ngOnInit(): void {
    if( localStorage.getItem('darkMode') === '1' ){
      this.renderer.setAttribute( this.document.body, 'class', 'dark-theme' )
    } else {
      this.renderer.setAttribute( this.document.body, 'class', 'light-theme' )
    }
  }


  switchTheme( isDark: boolean ){
    const theme = isDark ? 'dark-theme' : 'light-theme'
    this.renderer.setAttribute( this.document.body, 'class', theme )
    localStorage.setItem('darkMode', isDark === true ? '1' : '0')
  }
}
