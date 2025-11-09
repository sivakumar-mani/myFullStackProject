import { Component } from '@angular/core';
import { Dashboard } from '../services/dashboard';
import { Snackbar } from '../services/snackbar';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { globalConstant } from '../shared/global-constants';

@Component({
  selector: 'app-dashboards',
  imports: [],
  templateUrl: './dashboards.html',
  styleUrl: './dashboards.scss'
})
export class Dashboards {
  responseMessage:any
  data:any
  constructor( private dashboardService:Dashboard,
    private snackbarService:Snackbar,
    private ngxService:NgxUiLoaderService  ){
      this.ngxService.start();
      this.dashboardData();
    }
    dashboardData(){
      this.dashboardService.getDetails().subscribe({
        next:     (response:any)=>{
        this.ngxService.stop();
        this.data = response;
        console.log(this.data);
      },error:(error)=>{
        this.ngxService.stop();
        console.log(error);
        if(error.error?.message){
          this.responseMessage = error.error?.message;
        }
        else {
          this.responseMessage = globalConstant.genericError
        }
      }
      }
    )
    }
}
