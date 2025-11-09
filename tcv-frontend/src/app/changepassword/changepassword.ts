import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule,  NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { Snackbar } from '../services/snackbar';
import { User } from '../services/user';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { globalConstant } from '../shared/global-constants';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
@Component({
  selector: 'app-changepassword',
  imports: [MatFormFieldModule, NgIf, MatError, MatToolbarRow,MatInputModule, MatToolbar, MatDialogModule, FormsModule,
    ReactiveFormsModule, CommonModule
  ],
  templateUrl: './changepassword.html',
  styleUrl: './changepassword.scss'
})
export class Changepassword {
  changePasswordForm:any = FormGroup;
  responseMessage:any;

  constructor(private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<Changepassword>,
    private ngxService: NgxUiLoaderService,
    private snackbarService: Snackbar,
    private userService:User
  ){}

  ngOnInit():void{
    this.changePasswordForm = this.formBuilder.group({
      oldPassword:[null,[Validators.required]],
      newPassword:[null,[Validators.required]],
      confirmPassword:[null,[Validators.required]]
    })
  }

  validateSubmit(){
    if(this.changePasswordForm.controls['newPassword'].value != this.changePasswordForm.controls['confirmPassword'].value){
      return true
    }else {
      return false;
    }
  }

  handleChangePasswordSubmit(){
    this.ngxService.stop();
    var formData = this.changePasswordForm.value;
    var data ={
      oldPassword: formData.oldPassword,
      newPassword:formData.newPassword,
      confirmPassword: formData.confirmPassword
    }
    this.userService.changePassword(data).subscribe({
      next:(response:any)=>{
        this.ngxService.stop();
        this.dialogRef.close();
        this.responseMessage = response?.message;
        this.snackbarService.openSnackBar(this.responseMessage,"Success");
      }, error:(error)=>{
        console.log(error);
        this.ngxService.stop();
        if(error.error?.message){
          this.responseMessage = error.error?.message;
        }
        else{
          this.responseMessage = globalConstant.genericError;
        }
        this.snackbarService.openSnackBar(this.responseMessage, globalConstant.error)
      }
    })
  }
}
