import { Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ProductServices } from '../../services/product-services';
import { Category } from '../../services/category';
import { Snackbar } from '../../services/snackbar';
import { globalConstant } from '../../shared/global-constants';
import { response } from 'express';
import { NgFor, NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-product',
  imports: [ NgIf, NgFor, MatFormFieldModule,ReactiveFormsModule, MatDialogModule, MatInputModule, MatSelectModule, MatToolbarModule],
  templateUrl: './product.html',
  styleUrl: './product.scss'
})
export class Product {
  onAddProduct = new EventEmitter;
  onEditProduct = new EventEmitter;
  productForm: any = FormGroup;
  dialogAction: any = "Add";
  action: any = "Add";
  respsonseMessage: any;
  category: any = [];

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder,
    private productService: ProductServices,
    public dialogRef: MatDialogRef<Product>,
    private categoryService: Category,
    private snackbarService: Snackbar) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern(globalConstant.nameRegex)]],
      categoryId: [null, [Validators.required]],
      price: [null, [Validators.required]],
      description: [null, [Validators.required]]
    });

    if(this.dialogData.action === 'Edit'){
      this.dialogAction = "Edit";
      this.action="update";
      this.productForm.patchValue(this.dialogData.data);
    }
    this.getCategory();
  }

  getCategory(){
    this.categoryService.getCategory().subscribe({
      next:(response:any)=>{
        this.category = response;
      },error:(error:any)=>{
        if(error.error?.message){
          this.respsonseMessage = error.error?.message;
        }
        else{
          this.respsonseMessage = globalConstant.genericError;
        }
        this.snackbarService.openSnackBar(this.respsonseMessage, globalConstant.error);
      }

    })
  }
  handleSubmit(){
    if(this.dialogAction == "Edit"){
      this.edit();
    }else {
      this.add();
    }
  }
  add(){
    var formData = this.productForm.value;
    var data ={
      name:formData.name,
      categoryId:formData.categoryId,
      price:formData.price,
      description:formData.description,
    }
    this.productService.add(data).subscribe({
      next:(response:any)=>{
        this.dialogRef.close();
        this.onAddProduct.emit();
        this.respsonseMessage = response.message;
        this.snackbarService.openSnackBar(this.respsonseMessage, "success");
      },error:(error:any)=>{
        if(error.error?.message){
          this.respsonseMessage = error.error?.message
        }else{
          this.respsonseMessage = globalConstant.genericError
        }
        this.snackbarService.openSnackBar(this.respsonseMessage, globalConstant.error);
      }
    })
  };

  edit(){
    var formData= this.productForm.value;
    var data ={
      id: this.dialogData.data.id,
      name:formData.name,
      categoryId:formData.categoryId,
      price:formData.price,
      description:formData.description
    }
    this.productService.update(data).subscribe({
      next:(response:any)=>{
        this.dialogRef.close();
        this.onEditProduct.emit();
        this.respsonseMessage = response.message;
        this.snackbarService.openSnackBar(this.respsonseMessage, "Success");
      },error:(error:any)=>{
        if(error.error?.message){
          this.respsonseMessage = error.error?.message;
        }
        else{
          this.respsonseMessage= globalConstant.genericError
        }
        this.snackbarService.openSnackBar(this.respsonseMessage, globalConstant.error);
      }
    })
  }
}
