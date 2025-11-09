import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { environment } from "../../environments/environment"
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class User {
  private url = environment.apiUrl;
  constructor( private http : HttpClient){}

  signup(data:any):Observable<any>{
    return this.http.post(`${this.url}/user/signup`, data, {
      headers: new HttpHeaders().set('content-type', "application/json")
    });
  }

  forgotPassword(data:any):Observable<any>{
    return this.http.post(`${this.url}/user/forgotPassword`, data,{
      headers:new HttpHeaders().set('content-type',"application/json")
    });
  }

  login(data:any):Observable<any>{
    return this.http.post(`${this.url}/user/login`,data,{
      headers: new HttpHeaders().set('content-type', "application/json")
    })
  }

  checkToken():Observable<any>{
    return this.http.get(`${this.url}/user/checkToken`);
  }

  changePassword(data:any){
    return this.http.post(`${this.url}/user/changePassword`,data,{
      headers: new HttpHeaders().set('content-type',"application/json")
    })
  }
  getUsers(){
    return this.http.get(`${this.url}/user/get`);
  }
  updateUser(data:any){
    return this.http.patch(`${this.url}/user/update`,data,{
      headers: new HttpHeaders().set( 'Content-type',"application/json")
    })
  }
}
