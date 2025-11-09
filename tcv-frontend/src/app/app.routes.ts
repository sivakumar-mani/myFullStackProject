import { Routes } from '@angular/router';
import { Layout } from './common/layout/layout';
import { Dashboards } from './dashboards/dashboards'
import { RouteGuard } from './services/route-guard';
import { Home } from './common/home/home'
import { Login } from './login/login';
import { ManageCategory } from './material/manage-category/manage-category';
import { ManageProduct } from './material/manage-product/manage-product';
import { ManageOrder } from './material/manage-order/manage-order';
import { ViewBill } from './material/view-bill/view-bill';
import { ManageUser } from './material/manage-user/manage-user';

export const routes: Routes = [
    //  { path: '', redirectTo: '/', pathMatch:'full' },
    { path: '', component: Login },
    {
        path: '',
        component: Layout,
        children: [
            {
                path: 'dashboards',
                component: Dashboards,
                canActivate: [RouteGuard],
                data: {
                    expectedRole: ['admin', 'user']
                }
            },
            {
                path:'category',
                component: ManageCategory,
                canActivate: [RouteGuard],
                data: {
                    expectedRole: ['admin']
                }
            },
            {
                path:'product',
                component: ManageProduct,
                canActivate: [RouteGuard],
                data: {
                    expectedRole: ['admin']
                }
            },
             {
                path:'order',
                component: ManageOrder,
                canActivate: [RouteGuard],
                data: {
                    expectedRole: ['admin','user']
                }
            },
            {
                path:'view-bill',
                component: ViewBill,
                canActivate: [RouteGuard],
                data: {
                    expectedRole: ['admin','user']
                }
            },
            {
                path:'view-users',
                component: ManageUser,
                canActivate: [RouteGuard],
                data: {
                    expectedRole: ['admin']
                }
            }

        ]
    },
];
