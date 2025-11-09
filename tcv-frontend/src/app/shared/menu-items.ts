import { Injectable } from '@angular/core';

export interface Menu{
    state:string;
    name:string;
    icon:string;
    role:string;
}

const MENUITEMS: Menu[]= [
    { state:'dashboards', name:'Dashboards', icon:'dashboards', role:''},
    { state:'category', name:'ManageCategory', icon:'category', role:'admin'},
    { state:'product', name:'ManageProduct', icon:'inventory_2', role:'admin'},
     { state:'order', name:'ManageOrder', icon:'list_alt', role:''},
      { state:'view-bill', name:'ViewBill', icon:'import_contacts', role:''},
        { state:'view-users', name:'ManageUser', icon:'import_contacts', role:'admin'}
]

@Injectable()

export class MenuItems{
    getMenuItem():Menu[]{
        return MENUITEMS;
    }
}

