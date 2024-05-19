import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styles: [
  ]
})
export class AuthDialogComponent implements OnInit {

  constructor( private fb: FormBuilder  ) { }

  ngOnInit(): void {

  }

  emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
  passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/gm // 6 char, 1 mayus, 1 minus, 1 num
  showRegisterForm: boolean = false;

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(this.emailRegex)] ],
    password: ['', [Validators.required, Validators.minLength(6) ]]
  })


}
