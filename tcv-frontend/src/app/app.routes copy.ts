import { Routes } from '@angular/router';
import { Layout } from './common/layout/layout';
import { Dashboards } from './dashboards/dashboards'
import { RouteGuard } from './services/route-guard';
import { Login } from './login/login'

export const routes: Routes = [
     {
        path:'',
        redirectTo: 'Login',
        // pathMatch:'full'
    },
    {
        path:'',
        component: Login,
    },
        {
        path:'tcv',
        component: Layout,
        children:[
            {
                path:'dashboards',
                component: Dashboards,
                // canActivate:[ RouteGuard],
                // data:{
                //     expectedRole :['admin','user']
                // }
            }
            
        ]
    }
];
