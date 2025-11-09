import { Component } from '@angular/core';
import {  NgxUiLoaderService } from 'ngx-ui-loader';
import { User } from '../../services/user';
import { Snackbar } from '../../services/snackbar';
import { response } from 'express';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { globalConstant } from '../../shared/global-constants';
import { fileURLToPath } from 'url';
import { error } from 'console';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCard } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
@Component({
  selector: 'app-manage-user',
  imports: [ MatSlideToggle, MatTableModule, MatFormFieldModule,MatInputModule, MatCard],
  templateUrl: './manage-user.html',
  styleUrl: './manage-user.scss'
})
export class ManageUser {
displayedColumns:string[]=['name','email','contactNumber','status'];
dataSource:any;
responseMessage:any;

constructor( private ngxService:NgxUiLoaderService,
  private userService:User,
  private snackbarService: Snackbar
){}

ngOnInit():void{
  this.ngxService.start();
  this.tableData();
}

tableData(){
  this.userService.getUsers().subscribe({
    next:(response:any)=>{
      this.ngxService.stop();
      this.dataSource = new MatTableDataSource(response);
    }, error:(error:any)=>{
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else{
        this.responseMessage = globalConstant.error
      }
      this.snackbarService.openSnackBar(this.responseMessage, globalConstant.genericError);
    }
  })
}
applyFilter(event:Event){
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
}

handleChangeAction(status:any, id:any){
  this.ngxService.start();
  var data ={
    status:status.toString(),
    id:id
  }
  this.userService.updateUser(data).subscribe({
    next: (response:any)=>{
    this.ngxService.stop();
    this.responseMessage = response?.message;
    this.snackbarService.openSnackBar(this.responseMessage, "Success");
  },error:(error:any)=>{
    if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else{
        this.responseMessage = globalConstant.error
      }
      this.snackbarService.openSnackBar(this.responseMessage, globalConstant.genericError);
  }
  })

  }

}
