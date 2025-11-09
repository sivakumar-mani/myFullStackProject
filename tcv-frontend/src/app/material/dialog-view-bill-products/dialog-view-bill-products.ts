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
import { DialogRef } from '@angular/cdk/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-dialog-view-bill-products',
 imports: [MatFormFieldModule,MatInputModule,
     MatDialogModule, FormsModule,MatTableModule,
    ReactiveFormsModule, CommonModule ,MatToolbarRow, MatToolbar,], 
  templateUrl: './dialog-view-bill-products.html',
  styleUrl: './dialog-view-bill-products.scss'
})
export class DialogViewBillProducts {

  displayedColumns:string[]=['name', 'category','price','quantity','total'];
  dataSource:any=[];
  data:any;
  constructor( @Inject(MAT_DIALOG_DATA) public dialogData:any,
  public dialogRef: MatDialogRef<DialogViewBillProducts>){}


  ngOnInit():void{
    this.data =  this.dialogData.data;
    console.log("conssle", this.data);
    this.dataSource = JSON.stringify(this.dialogData.data.productDetails)
    
  }
}
