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
import {MatInputModule} from '@angular/material/input';


@Component({
  selector: 'app-forgot-password',
   imports: [MatFormFieldModule,MatInputModule, MatError, MatToolbarRow, MatToolbar, 
    MatDialogModule, FormsModule,
    ReactiveFormsModule, CommonModule
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss'
})
export class ForgotPassword {
 forgotPasswordForm:any = FormGroup;
 responseMessage:any

 constructor(
  private formBuilder: FormBuilder,
  private router:Router,
  private snackbarService:Snackbar,
  private userServices: User,
  private dialogRef: MatDialogRef<ForgotPassword>,
  private ngxService: NgxUiLoaderService){}

  ngOnInit(){
    this.forgotPasswordForm = this.formBuilder.group({
      email:[null,[Validators.required, Validators.pattern(globalConstant.emailRegex)]]
    })
  }
  handleSubmit(){
    this.ngxService.start();
    var formData=this.forgotPasswordForm.value;
    var data={
      email:formData.email
    }
    this.userServices.forgotPassword(data).subscribe((response:any)=>{
      this.ngxService.stop();
      this.responseMessage = response?.message;
      this.dialogRef.close();
      this.snackbarService.openSnackBar(this.responseMessage,"");
    },(error)=>{
      this.ngxService.stop();
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = globalConstant.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,globalConstant.error);
    });
  }
}
