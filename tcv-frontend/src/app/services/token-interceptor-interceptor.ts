import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

export const tokenInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const token =localStorage.getItem('token');
  const router = inject(Router);
  if(token){
    req = req.clone({
      setHeaders:{ Authorization: `Bearer ${token}`}
    })
  }
  return next(req).pipe(
    catchError((err)=>{
      if( err instanceof HttpErrorResponse){
        console.log(err.url);
        if(err.status === 401 || err.status === 403){
          if(router.url === '/tcv'){}
          else{
            localStorage.clear();
            router.navigate(['/'])
          }
        }
      }
      return throwError(err);
    })
  );
  
};
