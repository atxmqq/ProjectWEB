import { Component, AfterViewInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, Router } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { lastValueFrom } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { UserGetRespon } from '../../../../model/UserGetRespon';
import { ImageGetRespon } from '../../../../model/ImageGetRespon';

import { NgxSpinnerModule ,NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-userlist',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatDividerModule, HttpClientModule, CommonModule,NgxSpinnerModule],
  templateUrl: './userlist.component.html',
  styleUrl: './userlist.component.scss'
})
export class UserlistComponent {

  userdata: UserGetRespon[] = [];
  flag: boolean = false; // เพิ่มตัวแปร flag เพื่อตรวจสอบการมี token
  Alluserdata: UserGetRespon[] = [];

  constructor(private http: HttpClient, private router: Router,private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();

    setTimeout(() => {
      this.spinner.hide();
    }, 1000);

    this.getAllUserdata();

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

  getAllUserdata() {
    const url = 'https://backend-projectanidex.onrender.com/user';
    this.http.get<UserGetRespon[]>(url).subscribe((data: UserGetRespon[]): void => {
      if (data && data.length > 0) {
        this.Alluserdata = data;
      } else {
        console.log('No user data found');
      }
    });
  }














  logOut() {
    localStorage.removeItem('token');
    this.userdata = [];
    this.router.navigateByUrl('/login');
  }

}



