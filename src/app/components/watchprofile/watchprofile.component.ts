import { Component, AfterViewInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { lastValueFrom } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Getuserjoinimg, UserGetRespon } from '../../../../model/UserGetRespon';
import { ImageGetRespon } from '../../../../model/ImageGetRespon';
import { MatIconModule } from '@angular/material/icon';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-watchprofile',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatDividerModule, HttpClientModule, CommonModule, MatIconModule, FormsModule, NgxSpinnerModule],
  templateUrl: './watchprofile.component.html',
  styleUrl: './watchprofile.component.scss'
})
export class WatchprofileComponent {

  userdata: UserGetRespon[] = [];
  flag: boolean = false; // เพิ่มตัวแปร flag เพื่อตรวจสอบการมี token
  uid: any;

  userdatauid: Getuserjoinimg[] = [];
  imguser: UserGetRespon[] = [];





  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router,private spinner: NgxSpinnerService) { }

  ngOnInit() {

    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 1000);

    this.route.params.subscribe((params) => {
      this.uid = params['uid'];

      this.getuserbyUid(this.uid);
      this.getuserbyImg(this.uid);
    });

    const token = localStorage.getItem('token');
    if (token) {
      console.log('Token:', token);

      try {
        const url = `https://backend-projectanidex.onrender.com/user/${token}`;
        this.http.get(url).subscribe((data: any) => {
          if (data) {
            this.userdata = [data];
            this.uid = data.uid;
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


  getuserbyUid(uid: number): void {
    const getuserbyUid = `https://backend-projectanidex.onrender.com/user/watchprofile/${uid}`;
    this.http.get(getuserbyUid).subscribe(
      (data: any) => {
        this.userdatauid = data;
        console.log(this.userdatauid);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getuserbyImg(uid: number): void {
    const getuserbyImg = `https://backend-projectanidex.onrender.com/user/byuid/${uid}`;
    this.http.get(getuserbyImg).subscribe(
      (data: any) => {
        this.imguser = data;
        console.log(this.imguser);
      },
      (error) => {
        console.log(error);
      }
    );
  }






}
