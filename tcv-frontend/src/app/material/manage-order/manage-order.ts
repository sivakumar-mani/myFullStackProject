import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from '../../services/category';
import { Snackbar } from '../../services/snackbar';
import { BillService } from '../../services/bill-service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { globalConstant } from '../../shared/global-constants';
import { ProductServices } from '../../services/product-services';
import { saveAs } from 'file-saver';
import { NgModule } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
@Component({
  selector: 'app-manage-order',
  imports: [MatFormFieldModule,CommonModule,FormsModule,MatError, ReactiveFormsModule,RouterModule,
    MatSelectModule,MatInputModule,MatTableModule,MatCardModule,MatButtonModule,MatIconModule,MatDatepickerModule,
    MatNativeDateModule,
    NgIf, NgFor
  ],
  templateUrl: './manage-order.html',
  styleUrl: './manage-order.scss'
})
export class ManageOrder {
  displayedColumns: string[] = ['name', 'category', 'price', 'quantity', 'total', 'edit'];
  dataSource: any = [];
  manageOrderForm: any = FormGroup;
  categorys: any = [];
  products: any = [];
  price: any;
  totalAmount: number = 0;
  responseMessage: any;

  constructor(private formBuilder: FormBuilder,
    private categoryService: Category,
    private productService: ProductServices,
    private snackbarService: Snackbar,
    private billService: BillService,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.getCategorys()
    this.manageOrderForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern(globalConstant.nameRegex)]],
      email: [null, [Validators.required, Validators.pattern(globalConstant.emailRegex)]],
      contactNumber: [null, [Validators.required, Validators.pattern(globalConstant.contactNumberRegex)]],
      paymentMethod: [null, [Validators.required]],
      product: [null, [Validators.required]],
      category: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
      price: [null, [Validators.required]],
      total: [0, [Validators.required]]
    })
  }

  getCategorys() {
    this.categoryService.getCategory().subscribe({
      next: (response: any) => {
        this.ngxService.stop();
        this.categorys = response;
      }, error: (error: any) => {
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = globalConstant.genericError;
        }
        this.snackbarService.openSnackBar(this.responseMessage, globalConstant.error);
      }
    })
  }

  getProductsByCategory(value: any) {
    console.log("categoryid",value);
    this.productService.getProductsByCategory(value.id).subscribe({
      next: (response: any) => {
        this.products = response;
        console.log("response",response);
        this.manageOrderForm.constrols['price'].setValue();
        this.manageOrderForm.constrols['quantity'].setValue('');
        this.manageOrderForm.constrols['total'].setValue(0);
      }, error: (error: any) => {
        this.ngxService.stop();
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = globalConstant.genericError
        }
        this.snackbarService.openSnackBar(this.responseMessage, globalConstant.error);
      }

    })
  }
  getProductsDetails(value: any) {
    this.productService.getById(value.id).subscribe({
      next: (response: any) => {

        this.manageOrderForm.controls['price'].setValue(response.price);
        this.manageOrderForm.controls['quantity'].setValue('1');
        this.manageOrderForm.constrols['total'].setValue(this.price * 1);
      }, error: (error: any) => {
        this.ngxService.stop();
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = globalConstant.genericError
        }
        this.snackbarService.openSnackBar(this.responseMessage, globalConstant.error)
      }
    })
  }
  setQuantity(values: any) {
    var temp = this.manageOrderForm.controls['quantity'].value;
    if (temp > 0) {
      this.manageOrderForm.controls['total'].setValue(this.manageOrderForm.controls['quantity'].value * this.manageOrderForm.controls['price'].value);
    } else if (temp != '') {
      this.manageOrderForm.controls['quantity'].setValue('1');
      this.manageOrderForm.controls['total'].setValue(this.manageOrderForm.controls['quantity'].value * this.manageOrderForm.controls['price'].value);
    }
  }
  validateProductAdd() {
    if (this.manageOrderForm.controls['total'].value === 0 || this.manageOrderForm.controls['total'] === null || this.manageOrderForm.constrols['quantity'].value <= 0)
      return true;
    else
      return false;
  }

  validateSubmit() {
    if (this.totalAmount === 0 || this.manageOrderForm.controls['name'].value === null || 
      this.manageOrderForm.controls['email'].value === null || 
      this.manageOrderForm.controls['contactNumber'].value === null ||
       this.manageOrderForm.controls['paymentMethod'].value === null || 
       !(this.manageOrderForm.controls['contactNumber'].valid) || !(this.manageOrderForm.controls['email'].valid))
      return true;
    else
      return false;
  }

  add(){
    var formData = this.manageOrderForm.value;
    var productName = this.dataSource.find((e:{id:number})=> e.id == formData.product.id );
    if(productName == undefined){
      this.totalAmount = this.totalAmount + formData.total;
      this.dataSource.push({
        id:formData.product.id,
        name:formData.product.name,
        category:formData.category.name,
        quantity: formData.quantity,
        price:formData.price,
        total:formData.total
      });
      this.dataSource=[...this.dataSource];
      this.snackbarService.openSnackBar(globalConstant.productAdded,"Success");
    }else{
      this.snackbarService.openSnackBar(globalConstant.productExistError, globalConstant.error);
    }
  }

  handleDeleteAction(value:any, element:any){
    this.totalAmount = this.totalAmount - element.total;
    this.dataSource.splice(value, 1);
    this.dataSource=[...this.dataSource];
  }
  submitAction(){
    this.ngxService.start();
    var formData = this.manageOrderForm.value;
    var data={
      name:formData.name,
      email:formData.email,
      contactNumber: formData.contactNumber,
      paymentMethod: formData.paymentMethod,
      totalAmount: formData.totalAmount,
      productDetails: JSON.stringify(this.dataSource)
    }
    this.billService.generateReport(data).subscribe({
      next:(response:any)=>{
      this.downloadFile(response?.uuid);
      this.manageOrderForm.reset();
      this.dataSource=[];
      this.totalAmount=0;
    },error:  (error:any)=>{
      this.ngxService.stop();
      if(error.error?.message){
        this.responseMessage = error.error?.message
      }else{
        this.responseMessage = globalConstant.genericError
      }
      this.snackbarService.openSnackBar(this.responseMessage, globalConstant.error);
      
    }
    })
    
  }
  downloadFile(fileName:any){
    var data ={
      uuid: fileName
    }
    this.billService.getPdf(data).subscribe((response:any)=>{
      saveAs(response, fileName +'.pdf');
      this.ngxService.stop()
    })
  }
}
