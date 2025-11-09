import { Component } from '@angular/core';
import { BillService } from '../../services/bill-service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Snackbar } from '../../services/snackbar';
import { Router } from '@angular/router';
import { response } from 'express';
import { MatTableDataSource,MatTableModule } from '@angular/material/table';
import { globalConstant } from '../../shared/global-constants';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Product } from '../product/product';
import { Confirmation } from '../../dialog/confirmation/confirmation';
import { DialogViewBillProducts } from '../dialog-view-bill-products/dialog-view-bill-products';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-view-bill',
  imports: [MatFormFieldModule,MatCardModule,MatTableModule,MatInputModule],
  templateUrl: './view-bill.html',
  styleUrl: './view-bill.scss'
})
export class ViewBill {
  displayedColumns:string[]=['name','email','contactNumber','paymentMethod','total','view'];
  dataSource:any;
  responseMessage:any

  constructor(
    private billSerive:BillService,
    private ngxService:NgxUiLoaderService,
    private dialog:MatDialog,
    private snackbarService:Snackbar,
    private router:Router
  ){}

  ngOnInit():void{
    this.ngxService.start();
    this.tableData();
  }
  tableData(){
    this.billSerive.getBills().subscribe({
      next: (response:any)=>{
        this.ngxService.stop();
        this.dataSource = new MatTableDataSource(response);
      },error:(error:any)=>{
        if(error.error?.message){
          this.responseMessage = error.error?.message
        }else {
          this.responseMessage = globalConstant.genericError
        }
        this.snackbarService.openSnackBar(this.responseMessage, globalConstant.error);
      }
    })
  }

  applyFilter(event:Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  handleViewAction(values:any){
    const dialogConfig= new MatDialogConfig();
    dialogConfig.data={
      data:values
    }
    dialogConfig.width="100%";
    const dialogRef = this.dialog.open(DialogViewBillProducts, dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    })
    console.log("this data", values)
  }
  downloadReportAction(values:any){
    this.ngxService.start();
    var data = {
      name:values.name,
      email:values.email,
      uuid:values.uuid,
      contactNumber:values.contactNumber,
      paymentMethod:values.paymentMethod,
      totalAmount: values.total,
      productDetails:values.productDetails
    }
    this.billSerive.getPdf(data).subscribe((response:any)=>{
      saveAs(response, values.uuid+ 'pdf');
      this.ngxService.stop();
    })
  }

  handleDeleteAction(values:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data={
      message: 'dalete'+ values.name+ 'bill'
    }
    const dialogRef = this.dialog.open(Confirmation, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response)=>{
      this.ngxService.stop();
      this.deleteProduct(values.id);
      dialogRef.close();
    })
  }
  deleteProduct(id:any){
    this.billSerive.delete(id).subscribe({
      next:(response:any)=>{
        this.ngxService.stop();
        this.tableData();
        this.responseMessage = response?.message;
        this.snackbarService.openSnackBar(this.responseMessage,"Success");
      },error:(error:any)=>{
        if(error.error?.message){
          this.responseMessage= error.error?.message;
        }else{
          this.responseMessage = globalConstant.genericError
        }
        this.snackbarService.openSnackBar(this.responseMessage, globalConstant.error);
      }
    })
  }
}
