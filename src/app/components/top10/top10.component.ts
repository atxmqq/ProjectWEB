import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { UserGetRespon } from '../../../../model/UserGetRespon';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ImageGetRespon } from '../../../../model/ImageGetRespon';

@Component({
  selector: 'app-top10',
  standalone: true,
  imports: [RouterLink, MatButtonModule, HttpClientModule, FormsModule, CommonModule],
  templateUrl: './top10.component.html',
  styleUrl: './top10.component.scss'
})
export class Top10Component {
  userdata: UserGetRespon[] = [];
  flag: boolean = false; // เพิ่มตัวแปร flag เพื่อตรวจสอบการมี token
  showPreviousImages: boolean = false; // สร้างตัวแปร showPreviousImages เพื่อควบคุมการแสดงผลของรูปภาพก่อนหน้า

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {

    this.getImageUrl();
    this.getImageUrlprevious();

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


  imageUrl: ImageGetRespon[] = [];
  imageUrlprevious: ImageGetRespon[] = [];


  getImageUrl() {
    const url = 'http://localhost:3000/image';
    this.http.get<ImageGetRespon[]>(url).subscribe((data: ImageGetRespon[]): void => {
      if (data && data.length > 0) {
        this.imageUrl = data;
      } else {
        console.log('No image data found');
      }
      // จัดเรียง imageUrl โดยให้คะแนนสูงสุดมาก่อน
      this.imageUrl.sort((a, b) => b.score - a.score);

    });
  }

  getImageUrlprevious() {
    const url = 'http://localhost:3000/nowscore';
    this.http.get<ImageGetRespon[]>(url).subscribe((data: ImageGetRespon[]): void => {
      if (data && data.length > 0) {
        this.imageUrlprevious = data;
      } else {
        console.log('No image data found');
      }

      this.imageUrlprevious.sort((a, b) => b.total_score - a.total_score);

    });
  }
  
  toggleImages() {
    this.showPreviousImages = !this.showPreviousImages; // เปลี่ยนค่าเมื่อกดปุ่ม

    if (this.showPreviousImages) {
      // โหลดข้อมูลรูปภาพก่อนหน้าเมื่อปุ่มถูกกด
      this.getImageUrlprevious();
    } else {
      // โหลดข้อมูลรูปภาพปัจจุบันเมื่อปุ่มถูกปล่อย
      this.getImageUrl();
    }
  }


}
