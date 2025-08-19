import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Login } from '../models/login';
import { Observable, map } from 'rxjs';
import { Token } from '../models/token';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  login(data: Login): Observable<Token> {
    console.log(data)
    return this.http.post<Token>(this.apiUrl + 'api/auth/', data)
      .pipe(
        map((res => {
          if (res.token !== null) {
            sessionStorage.setItem('token', res.token);
          }
          return res;
        }))
      )

  }

  isLoggedIn(): boolean {
    let token = this.getToken();

    if (!token)
      return false;

    return !this.isTokenExpired();
  }

  private isTokenExpired() {
    let token = this.getToken();

    if (!token)
      return true;

    let decoded = jwtDecode(token);

    let isTokenExpired = Date.now() >= decoded.exp! * 1000;

    if (isTokenExpired)
      this.logout();

    return isTokenExpired;

  }

  getUserLogged() {
    let token = this.getToken();

    if (!token)
      return '';

    let decoded: any = jwtDecode(token);

    return decoded.unique_name;
  }

  logout = (): void => {
    sessionStorage.removeItem('token');
  }

  getToken = (): string | null => sessionStorage.getItem('token') || '';

  getDecodedToken() {
    let token = this.getToken()
    if (!token)
      return true;
    let decoded: any = jwtDecode(token);
    //console.log(decoded)
    return decoded
  }
  verifyIfuserHasHole(userRole: string) {
    let token = this.getToken()
    if (!token)
      return false
    let decoded: any = jwtDecode(token)
   ;// console.log("valor do decode ", decoded)
    const rolesArray = [].concat(decoded.role) // array
    let role = (r: string) => r === userRole || r === "admin"// comparacao 
  //  console.log(rolesArray.some(role))
    if (!rolesArray.some(role)) {
      return false
    }
    return true



  }
}
