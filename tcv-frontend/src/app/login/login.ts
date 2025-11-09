import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { Snackbar } from '../services/snackbar';
import { User } from '../services/user';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { globalConstant } from '../shared/global-constants';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { NgIf } from '@angular/common';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-login',
  imports: [MatFormFieldModule, MatInputModule, MatError, MatToolbarRow, MatToolbar,  FormsModule,
    ReactiveFormsModule, CommonModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  loginForm: any = FormGroup
  responseMessgae: any

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private snackbarServcie: Snackbar,
    private userService: User,
    // private dialogRef: MatDialogRef<Login>,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(globalConstant.emailRegex)]],
      password: [null, [Validators.required]]
    })
  }

  loginSubmit() {
    this.ngxService.start();
    var formData = this.loginForm.value;
    var data = {
      email: formData.email,
      password: formData.password
    }
    this.userService.login(data).subscribe({
       next: (response) => {
        this.ngxService.stop();
        localStorage.setItem('token', response.token);
        this.router.navigate(['/dashboards']);
      }, error: (error) => {
        this.ngxService.stop();
        if (error.error?.message) {
          this.responseMessgae = error.error?.message
        }
        else {
          this.responseMessgae = globalConstant.genericError
        }
        this.snackbarServcie.openSnackBar(this.responseMessgae, globalConstant.error)
      }
    })
  }
}
