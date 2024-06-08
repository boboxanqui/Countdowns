import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styles: [
  ]
})
export class AuthDialogComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AuthDialogComponent>,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public registerDialog: boolean
  ) { }

  ngOnInit(): void {
    this.showRegisterForm = this.registerDialog
  }

  emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+?[a-z0-9](?:[a-z0-9-]*[a-z0-9])+?/g;
  passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])/gm // 6 char, 1 mayus, 1 minus, 1 num
  showRegisterForm!: boolean;
  submittedLogin: boolean = false;
  submittedRegister: boolean = false;
  seeLoginPassword: boolean = false;
  seeRegisterPassword: boolean = false;
  showAuthErrors = {
    emailAlreadyInUse: false,
    invalidCredentials: false
  }

  formLogin: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  })

  formRegister: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(this.passwordRegex)
    ]]
  })

  getValueLogin(input: string) {
    return this.formLogin.get(input)?.value
  }

  getValueRegister(input: string) {
    return this.formRegister.get(input)?.value
  }

  invalidLogin(input: string) {
    return this.formLogin.controls[input].invalid && !this.showRegisterForm
  }

  invalidRegister(input: string) {
    return this.formRegister.controls[input].invalid && this.showRegisterForm
  }

  errorsRegister(input: string) {
    return this.formRegister.controls[input].errors
  }

  isPasswordRegisterInputLengthEnough() {
    const lengthEnough = 6;
    return this.getValueRegister('password').length >= lengthEnough
  }

  hasPasswordRegisterInputUpperCase() {
    const upperCase = /[A-Z]/g
    return upperCase.test(this.getValueRegister('password'))
  }

  hasPasswordRegisterInputLowerCase() {
    const lowerCase = /[a-z]/g
    return lowerCase.test(this.getValueRegister('password'))
  }

  hasPasswordRegisterInputNumber() {
    const anyNummber = /[0-9]/g
    return anyNummber.test(this.getValueRegister('password'))
  }

  visbleLoginPassword() {
    return this.seeLoginPassword ? 'text' : 'password'
  }

  visbleRegisterPassword() {
    return this.seeRegisterPassword ? 'text' : 'password'
  }

  inputFocus() {
    return this.formRegister.get('password')?.pristine
  }

  submitLogin() {
    this.submittedLogin = true;
    if (this.formLogin.invalid) return

    Object.entries(this.showAuthErrors).forEach( ([key,value] ) => {
      value = false;
      console.log( key + ' => ' + value)
    })

    this.authService.loginUser(
      this.getValueLogin('email'),
      this.getValueLogin('password')
    ).then(resp => {
      console.log(resp);
      this.authService.setUserData(resp);
      this.dialogRef.close();
    })
      .catch(err => {
        if( err.message.includes('invalid-login-credentials')){
          this.showAuthErrors.invalidCredentials = true;
        }
      })
  }

  submitRegister() {
    this.submittedRegister = true;
    if (this.formRegister.invalid) return

    Object.entries(this.showAuthErrors).forEach( ([key,value] ) => {
      value = false;
      console.log( key + ' => ' + value)
    })
    
    this.authService.registerUser(
      this.getValueRegister('email'),
      this.getValueRegister('password')
    )
      .then( console.log )
      .catch(err => {
        if(err.message.includes('email-already-in-use')){
          this.showAuthErrors.emailAlreadyInUse = true;
        }
      })
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle()
      .then( resp => {
        console.log(resp);
        this.authService.setUserData(resp);
        this.dialogRef.close();
      })
      .catch(err => {
        console.error(err.code);
        console.error(err.message)
      })
  }

  loginWithGithub() {
    this.authService.loginWithGithub()
      .then(resp => {
        console.log(resp);
        this.authService.setUserData(resp);
        this.dialogRef.close();
      })
      .catch(err => {
        console.error(err.code);
        console.error(err.message)
      })
  }
}
