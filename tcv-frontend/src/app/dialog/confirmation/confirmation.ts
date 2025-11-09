import { Component, EventEmitter, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-confirmation',
  imports: [ MatDialogModule, MatButtonModule],
  templateUrl: './confirmation.html',
  styleUrl: './confirmation.scss'
})
export class Confirmation {
  onEmitStatusChange = new EventEmitter();
  details:any ={};
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData:any){}
  
  ngOnInit():void{
    if(this.dialogData){
      this.details = this.dialogData;
    }
  }
  handleChangeAction(){
    this.onEmitStatusChange.emit();
  }
}
