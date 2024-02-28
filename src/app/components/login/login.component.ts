import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginObj: any = {
    "email": "",
    "password": ""
  };

  constructor(private http: HttpClient, private router: Router ) { }
  
  loGin() {
    if(this.loginObj.email && this.loginObj.password){
      this.http.post('http://localhost:3000/user/login', this.loginObj).subscribe((res: any) => {
        if(res.result){
          localStorage.setItem('token', res.data.token)
        }
      });
    }
  }
}
