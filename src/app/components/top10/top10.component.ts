import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { UserGetRespon } from '../../../../model/UserGetRespon';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ImageGetRespon } from '../../../../model/ImageGetRespon';

import { NgxSpinnerModule ,NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-top10',
  standalone: true,
  imports: [RouterLink, MatButtonModule, HttpClientModule, FormsModule, CommonModule,NgxSpinnerModule],
  templateUrl: './top10.component.html',
  styleUrl: './top10.component.scss'
})
export class Top10Component {
  userdata: UserGetRespon[] = [];
  flag: boolean = false; // เพิ่มตัวแปร flag เพื่อตรวจสอบการมี token
  showPreviousImages: boolean = false; // สร้างตัวแปร showPreviousImages เพื่อควบคุมการแสดงผลของรูปภาพก่อนหน้า

  constructor(private http: HttpClient, private router: Router,private spinner: NgxSpinnerService) { }

  ngOnInit() {

    this.getImageUrl();

    this.spinner.show();

    setTimeout(() => {
      this.spinner.hide();
    }, 1000);

  }


  imageUrl: ImageGetRespon[] = [];
  imageUrlprevious: ImageGetRespon[] = [];


  getImageUrl() {
    const url = 'https://backend-projectanidex.onrender.com/image';
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





}
