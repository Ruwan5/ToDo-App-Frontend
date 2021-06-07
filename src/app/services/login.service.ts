import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {User} from '../models/user.model'

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  selectedUser: User = {
    name: '',
    email: '',
    password: '',

  };

  constructor(public http: HttpClient) { }


  postUser(user: User){
    console.log(user);
    return this.http.post(environment.apiBaseUrl+'/register',user);
  }


  loginUser(user: User){
    // return this.http.post(environment.apiBaseUrl+'/register',user);
    return this.http.post(environment.apiBaseUrl+'/login',user);
  }

}
