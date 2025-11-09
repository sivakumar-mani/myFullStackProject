import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Category } from '../../services/category';
import { Snackbar } from '../../services/snackbar';
import { globalConstant } from '../../shared/global-constants';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule, NgIf } from '@angular/common';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-dialog-category',
  imports: [MatFormFieldModule,MatInputModule,NgIf,
     MatDialogModule, FormsModule,
    ReactiveFormsModule, CommonModule ,MatToolbarRow, MatToolbar,], 
  templateUrl: './dialog-category.html',
  styleUrl: './dialog-category.scss'
})
export class DialogCategory {
onAddCategory = new EventEmitter();
  onEditCategory = new EventEmitter();

 categoryForm:any = FormGroup;
 dialogAction:any = "Add";
 action:any = "Add";
 responseMessage:any;

 constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
private formBuilder: FormBuilder,
private categoryService: Category,
public dialogRef:MatDialogRef<DialogCategory>,
private snackbarService:Snackbar
){}

ngOnInit():void{
  this.categoryForm = this.formBuilder.group({
    name: [null,[Validators.required]]
  });
  debugger;
  if(this.dialogData.action === 'Edit'){
    debugger;
    this.dialogAction = "Edit";  
    this.action = "Update";
    this.categoryForm.patchValue(this.dialogData.data);
  }
}
handleSubmit(){
  if(this.dialogAction === "Edit"){
    this.edit();
  }
  else{
    this.add();
  }
}
add(){
  var formData = this.categoryForm.value;
  var data ={
    name :formData.name
  }
  this.categoryService.add(data).subscribe({
    next: (response:any)=>{
      this.dialogRef.close();
     this.onAddCategory.emit();
      this.responseMessage = response.message;
      this.snackbarService.openSnackBar(this.responseMessage, "Success");
    }, error: (error:any)=>{
      this.dialogRef.close();
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }
      else{
        this.responseMessage = globalConstant.genericError
      }
      this.snackbarService.openSnackBar(this.responseMessage, globalConstant.error);
    }
  })
}
edit(){
    var formData = this.categoryForm.value;
     var data = {
        id: this.dialogData.data.id,
        name: formData.name
      }
      this.categoryService.update(data).subscribe({
        next:(response:any)=>{
          this.dialogRef.close;
         this.onEditCategory.emit();
         this.responseMessage = response.message;
         this.snackbarService.openSnackBar(this.responseMessage, "Success");
        }, error: (error:any)=>{
          if(error.error?.message){
            this.responseMessage = error.error?.message;
          }
          else{
            this.responseMessage = globalConstant.error;
          }
          this.snackbarService.openSnackBar(this.responseMessage, globalConstant.error);
        }
      })
}

}
