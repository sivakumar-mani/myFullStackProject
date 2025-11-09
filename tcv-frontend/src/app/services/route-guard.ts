import { Injectable } from '@angular/core';
import { Auth } from '../services/auth'
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Snackbar } from './snackbar';
import { jwtDecode } from "jwt-decode";
import { globalConstant } from '../shared/global-constants';

@Injectable({
  providedIn: 'root'
})
export class RouteGuard {

  constructor(public auth: Auth,
    private router: Router,
    private snackbarService: Snackbar,
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    let expectedRoleArray = route.data;
    expectedRoleArray = expectedRoleArray['expectedRole'];
    if( typeof window !== undefined && localStorage){
    const token: any = localStorage.getItem('token');
    var tokenPayload: any;
    try {
      tokenPayload = jwtDecode(token)
    } catch (error) {
      localStorage.clear();
      this.router.navigate(['/']);
    }
  }
    let checkRole = false;
    for (let i = 0; i < expectedRoleArray['length']; i++) {
      if (expectedRoleArray[i] == tokenPayload.role) {
        checkRole = true;
      }
    }

    if (tokenPayload.role == 'user' || tokenPayload.role == 'admin') {
      if (this.auth.isAuthendicated() && checkRole) {
        return true
      }
      this.snackbarService.openSnackBar(globalConstant.unauthorized, globalConstant.error);
      this.router.navigate(['/dashboards']);
      return false;
    }
    else {
      this.router.navigate(['/']);
      localStorage.clear();
      return false;
    }
  }
 
}
