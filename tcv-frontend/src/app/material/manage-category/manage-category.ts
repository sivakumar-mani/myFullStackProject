import { Component, EventEmitter, Output } from '@angular/core';
import { Category } from '../../services/category';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Snackbar } from '../../services/snackbar';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { globalConstant } from '../../shared/global-constants';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { DialogCategory } from '../dialog-category/dialog-category';
@Component({
  selector: 'app-manage-category',
  imports: [MatFormFieldModule, MatTableModule, MatCardModule, MatInputModule, MatSelectModule],
  templateUrl: './manage-category.html',
  styleUrl: './manage-category.scss'
})
export class ManageCategory {
  displayedColumns: string[] = ['name', 'edit'];
  dataSource: any;
  responseMessage: any;

  constructor(
    private categoryService: Category,
    private ngxService: NgxUiLoaderService,
    private snackbarService: Snackbar,
    private dialog: MatDialog,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }
  tableData() {
    this.categoryService.getCategory().subscribe({
      next: (response: any) => {
        this.ngxService.stop();
        this.dataSource = new MatTableDataSource(response);
      }, error: (error) => {
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = globalConstant.genericError;
        }
        this.snackbarService.openSnackBar(this.responseMessage, globalConstant.error);
      }
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  handleAddCategory() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Add'
    }
    dialogConfig.width = "850px";
    const dialogRef = this.dialog.open(DialogCategory, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddCategory.subscribe(
     (response) => {
          this.tableData();
        }
    )
  }

  handleEditAction(values:any) { 
     const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Edit',
      data:values
    }
    dialogConfig.width = "850px";
    const dialogRef = this.dialog.open(DialogCategory, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onEditCategory.subscribe(
     (response) => {
          this.tableData();
        }
    )
  }

}
