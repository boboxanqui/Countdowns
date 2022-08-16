import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor( ) { }

  ngOnInit(): void {
    if( localStorage.getItem('darkMode') === '1' ){
      this.checked = true
    }
  }

  checked: boolean = false;

  @Output() darkModeOn = new EventEmitter<boolean>()

  switchTheme( change: MatSlideToggleChange ){
    this.darkModeOn.emit(change.checked)
    
  }

}
