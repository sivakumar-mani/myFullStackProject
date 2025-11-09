import { Component } from '@angular/core';
import { jwtDecode } from "jwt-decode";
import { MenuItems } from '../shared/menu-items'
import { NgForOf,NgIf, CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
@Component({
  selector: 'app-sidebar',
  imports: [ NgForOf,NgIf, CommonModule,MatIcon, RouterModule, MatListModule ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {
   menuList: any[] = [];
  token:any = localStorage.getItem('token');
  tokenPayload:any;

  constructor( private menuItems: MenuItems){
    this.tokenPayload = jwtDecode(this.token);
  }

   ngOnInit(): void {
    this.menuList = this.menuItems.getMenuItem();
  }
}
