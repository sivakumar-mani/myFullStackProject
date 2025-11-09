import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Category {
  url = environment.apiUrl;

  constructor(private http: HttpClient){}

  add(data:any):Observable<any>{
   return this.http.post(`${this.url}/category/add/`,data,{
    headers: new HttpHeaders().set('content-type',"application/json")
   });
  }
  update(data:any):Observable<any>{
    return this.http.patch(`${this.url}/category/update/`, data,{
      headers: new HttpHeaders().set('content-type',"application/json")
    });
  }
  getCategory(){
    return this.http.get(`${this.url}/category/get`);
  }
  
}
