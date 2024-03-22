import { Component, AfterViewInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, Router } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { lastValueFrom } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { UserGetRespon } from '../../../../model/UserGetRespon';
import { ImageGetRespon } from '../../../../model/ImageGetRespon';
import { MatIconModule } from '@angular/material/icon';



@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatDividerModule, HttpClientModule, CommonModule, MatIconModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements AfterViewInit {
  userdata: UserGetRespon[] = [];
  flag: boolean = false; // เพิ่มตัวแปร flag เพื่อตรวจสอบการมี token
  uid: any;
  fileUrl: any;

  imageDatabyPID: ImageGetRespon[] = [];
  pid: any;

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

  openPopupChange(pid: any): void {
    let popupchange = document.getElementById("popupchange");
    if (popupchange) {
      popupchange.classList.add("open-popup");
    }

    // ดึงข้อมูลรูปภาพตาม pid จากเซิร์ฟเวอร์
    const url = `https://backend-projectanidex.onrender.com/image/${pid}`;
    this.http.get<ImageGetRespon[]>(url).subscribe((data: ImageGetRespon[]): void => {
      if (data && data.length > 0) {
        this.imageDatabyPID = data;
      } else {
        console.log('No image data found');
      }
    });
  }



  closePopupChange() {
    let popupchange = document.getElementById("popupchange");
    if (popupchange) {
      popupchange.classList.remove("open-popup");
    }
  }



  file?: File;

  onFileSelected(event: Event) {
    if ((event.target as HTMLInputElement).files) {
      this.file = (event.target as HTMLInputElement).files![0];

      // ตรวจสอบว่า this.file ไม่เป็น null หรือ undefined ก่อนที่จะใช้งาน FileReader
      if (this.file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.fileUrl = e.target.result;
        };
        reader.readAsDataURL(this.file);
      }
    }
  }

  onFileSelectedChange(event: Event) {
    if ((event.target as HTMLInputElement).files) {
      this.file = (event.target as HTMLInputElement).files![0];

      // ตรวจสอบว่า this.file ไม่เป็น null หรือ undefined ก่อนที่จะใช้งาน FileReader
      if (this.file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.fileUrl = e.target.result;
        };
        reader.readAsDataURL(this.file);
      }
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



  uploadImageAnime() {
    // ตรวจสอบจำนวนรูปภาพที่มีในฐานข้อมูลสำหรับผู้ใช้นี้
    this.http.get<any>(`https://backend-projectanidex.onrender.com/upload/image_count/${this.uid}`)
      .toPromise()
      .then((countResponse) => {
        const imageCount = countResponse.image_count;
        if (imageCount >= 5) {
          console.log('Maximum image count reached for this user');
          alert('ไม่สามารถอัพโหลดได้');
        } else {
          // ดำเนินการอัพโหลดรูปภาพ
          if (!this.file) {
            console.log('No file selected.');
            return;
          }

          const formData = new FormData();
          formData.append('file', this.file);


          this.http.post<any>('https://backend-projectanidex.onrender.com/upload', formData)
            .toPromise()
            .then((response) => {
              console.log('Image uploaded. Firebase URL:', response.file);

              // ส่งข้อมูลไปยัง Express Route เพื่อเพิ่มข้อมูลลงใน MySQL
              const uploadData = {
                imganime: response.file,
                uid: this.uid
              };

              return this.http.post<any>('https://backend-projectanidex.onrender.com/upload/insertPictureAnime', uploadData)
                .toPromise();
            })
            .then(() => {
              console.log('Data added to MySQL successfully.');

              location.reload();

            })
            .catch((error) => {
              console.error('Error uploading image:', error);
            });
        }
      })
      .catch((error) => { });
  }




  uploadImageAnimeForChange(pid: any): void {
    // ตรวจสอบจำนวนรูปภาพที่มีในฐานข้อมูลสำหรับผู้ใช้นี้
    this.http.delete<any>(`https://backend-projectanidex.onrender.com/upload/deleteimg/${pid}`)
      .toPromise()
      .then((response) => {
        console.log('Delete successfully');
      })
      .catch((error) => {
        console.log('Delete ERRORR!!!!');
      });

    // ดำเนินการอัพโหลดรูปภาพ
    if (!this.file) {
      console.log('No file selected.');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.file);


    this.http.post<any>('https://backend-projectanidex.onrender.com/upload', formData)
      .toPromise()
      .then((response) => {
        console.log('Image uploaded. Firebase URL:', response.file);

        // ส่งข้อมูลไปยัง Express Route เพื่อเพิ่มข้อมูลลงใน MySQL
        const uploadData = {
          imganime: response.file,
          uid: this.uid
        };

        return this.http.post<any>('https://backend-projectanidex.onrender.com/upload/insertPictureAnime', uploadData)
          .toPromise();
      })
      .then(() => {
        console.log('Data added to MySQL successfully.');

        location.reload();
      })
      .catch((error) => {
        console.error('Error uploading image:', error);
      });
  }
}