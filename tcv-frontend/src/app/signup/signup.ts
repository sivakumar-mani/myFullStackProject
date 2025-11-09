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

@Component({
  selector: 'app-signup',
  imports: [MatFormFieldModule, MatInputModule, MatError, MatToolbarRow, MatToolbar, MatDialogModule, FormsModule,
    ReactiveFormsModule, CommonModule
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class Signup {
  signupForm: any = FormGroup;
  responseMessage: any

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private snackbarService: Snackbar,
    private userService: User,
    private dialogRef: MatDialogRef<Signup>,
    private ngxService: NgxUiLoaderService) { }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern(globalConstant.nameRegex)]],
      email: [null, [Validators.required, Validators.pattern(globalConstant.emailRegex)]],
      contactNumber: [null, [Validators.required, Validators.pattern(globalConstant.contactNumberRegex)]],
      password: [null, [Validators.required]]
    })
  }

  handleSubmit() {
    this.ngxService.start();
    var signupFormData = this.signupForm.value;
    var signupData = {
      name: signupFormData.name,
      email: signupFormData.email,
      contactNumber: signupFormData.contactNumber,
      password: signupFormData.password
    }
    this.userService.signup(signupData).subscribe({
      next: (response: any) => {
        this.ngxService.stop();
        this.dialogRef.close();
        this.responseMessage = response?.message;
        this.snackbarService.openSnackBar(this.responseMessage, "");
         this.router.navigate(['/dashboards']);
      }, error: (error) => {
        this.ngxService.stop();
        if (error.error?.message) {
          this.responseMessage = error.error?.message
        }
        else {
          this.responseMessage = globalConstant.genericError;
        }
        this.snackbarService.openSnackBar(this.responseMessage, globalConstant.error);
       
      }
    }
    )
  }
}
