import { Component, AfterViewInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, Router } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { lastValueFrom } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { UserGetRespon } from '../../../../model/UserGetRespon';
import { ImageGetRespon } from '../../../../model/ImageGetRespon';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatDividerModule, HttpClientModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements AfterViewInit {
  userdata: UserGetRespon[] = [];
  flag: boolean = false; // เพิ่มตัวแปร flag เพื่อตรวจสอบการมี token

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {

    this.getImageUrl();

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


  fileUrl: string | undefined;
  files: File[] = [];

  ngAfterViewInit(): void {
    // เรียกใช้งานฟังก์ชัน openPopup() และ closePopup()
    this.openPopup();
    this.closePopup();
  }

  openPopup() {
    let popup = document.getElementById("popup");
    if (popup) {
      popup.classList.add("open-popup");
    }
  }

  closePopup() {
    let popup = document.getElementById("popup");
    if (popup) {
      popup.classList.remove("open-popup");
    }
  }
  file?: File;


  async upload() {
    if (this.files.length > 0) {
      const url = 'http://localhost:3000/upload';
      const formData = new FormData();
      this.files.forEach((file) => {
        formData.append('files', file);
      });
      const response: any = await lastValueFrom(this.http.post(url, formData));
      console.log('Uploaded files:', response);
    }
  }

  onFileSelected(event: Event) {
    if ((event.target as HTMLInputElement).files) {
      const selectedFiles = (event.target as HTMLInputElement).files!;
      this.files.push(...Array.from(selectedFiles));

      // แสดงรูปที่เลือก
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.fileUrl = e.target.result;
      };
      reader.readAsDataURL(selectedFiles[0]);
    }
  }

  imageUrl: ImageGetRespon[] = [];

  getImageUrl() {
    const url = 'https://backend-projectanidex.onrender.com/image';
    this.http.get<ImageGetRespon[]>(url).subscribe((data: ImageGetRespon[]): void => {
      if (data && data.length > 0) {
        this.imageUrl = data;
      } else {
        console.log('No image data found');
      }
    });
  }

  logOut() {
    localStorage.removeItem('token');
    this.userdata = [];
    this.router.navigateByUrl('/login');
  }


}

