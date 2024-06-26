import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { UserGetRespon } from '../../../../model/UserGetRespon';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { NgxSpinnerModule ,NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [RouterLink, MatButtonModule, HttpClientModule, FormsModule, CommonModule,NgxSpinnerModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent {
  userdata: UserGetRespon[] = [];
  flag: boolean = false; // เพิ่มตัวแปร flag เพื่อตรวจสอบการมี token

  constructor(private http: HttpClient, private router: Router,private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();

    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Token:', token);

      try {
        const url = `https://backend-projectanidex.onrender.com/user/${token}`;
        this.http.get(url).subscribe((data: any) => {
          if (data) {
            this.userdata = [data];
            console.log('User data:', this.userdata);
          } else {
            console.log('No User data found');
          }
          this.flag = true; // กำหนดค่า flag เป็น true เมื่อมี token
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    } else {
      console.log('No token found in localStorage');
      this.flag = true; // กำหนดค่า flag เป็น true เมื่อไม่มี token
    }
  }

  logOut() {
    localStorage.removeItem('token');
    this.userdata = [];
    this.router.navigateByUrl('/login');
  }
}


