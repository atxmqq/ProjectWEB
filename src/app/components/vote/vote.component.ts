import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ImageGetRespon } from '../../../../model/ImageGetRespon';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ScoreTotal, UserGetRespon } from '../../../../model/UserGetRespon';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { NgxSpinnerModule ,NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-vote',
  standalone: true,
  imports: [RouterLink, CommonModule, HttpClientModule, FormsModule, MatButtonModule,NgxSpinnerModule],
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.scss'],
  providers: [DatePipe]

})
export class VoteComponent implements OnInit {
  userdata: UserGetRespon[] = [];
  user: UserGetRespon | undefined;
  flag: boolean = false;

  redImageVisible: boolean = true;
  blueImageVisible: boolean = true;

  winID: any;
  winScore: number | undefined;

  loseID: any;
  loseScore: number | undefined;
  totalScore: any;

  imageUrl: ImageGetRespon[] = [];
  shuffledImages: ImageGetRespon[] = [];
  votedImagesIds: Set<number> = new Set<number>();
  selectedImages: ImageGetRespon[] = [];
  uid: any

  constructor(private http: HttpClient, private datePipe: DatePipe,private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();

    setTimeout(() => {
      this.spinner.hide();
    }, 1000);

    this.getImageUrl();

    const token = localStorage.getItem('token');
    if (token) {
      console.log('Token:', token);
      try {
        const url = `https://backend-projectanidex.onrender.com/user/${token}`;
        this.http.get(url).subscribe((data: any) => {
          if (data) {
            this.userdata = [data];
            this.uid = data.uid
            console.log('User data:', this.userdata);
          } else {
            console.log('No User data found');
          }
          this.flag = true;
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    } else {
      console.log('No token found in localStorage');
      this.flag = true;
    }
  }

  getImageUrl() {
    const url = 'https://backend-projectanidex.onrender.com/voteimage';
    this.http.get<ImageGetRespon[]>(url).subscribe((data: ImageGetRespon[]): void => {
      if (data && data.length > 0) {
        this.shuffledImages = this.shuffleImages(data);
        this.imageUrl = data;
        this.calscore();
      } else {
        console.log('No image data found');
      }
    });
  }

  shuffleImages(images: ImageGetRespon[]) {
    let currentIndex = images.length;
    let randomIndex: number;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      // สลับรูปภาพที่ถูกสุ่มมา
      [images[currentIndex], images[randomIndex]] = [images[randomIndex], images[currentIndex]];
    }

    return images;
  }

  async clickImages(color: string, winID: any, winScore: number, loseID: any, loseScore: number) {
    if (color === 'red') {
      this.redImageVisible = true;
      this.blueImageVisible = false;
    } else {
      this.redImageVisible = false;
      this.blueImageVisible = true;
    }



    this.calvote(winID, loseID, winScore, loseScore); //เรียกใช้ calvote ส่ง winID, loseID, winScore, loseScore  ที่รับมาไปคำนวณ

    console.log('winID :', winID);
    console.log('score :', winScore);
    console.log('loseID :', loseID);
    console.log('score :', loseScore);

    this.winID = winID;
    this.winScore = winScore;
    this.loseID = loseID;
    this.loseScore = loseScore;
  }


  async vote(winID: any, loseID: any, defultwin: number, defultlose: number) {
    const urlvote = 'https://backend-projectanidex.onrender.com/anidexvote/score';



    const userID = this.uid;
    console.log('UserID:', userID);

    try {
      const voteDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');

      const Win = await this.http.post(urlvote, { uid_fk: userID, pid_fk: winID, winlose: 1, score: defultwin, vote_date: voteDate }).toPromise();
      const Lose = await this.http.post(urlvote, { uid_fk: userID, pid_fk: loseID, winlose: 0, score: defultlose, vote_date: voteDate }).toPromise();

      this.totalScore[winID] = (this.totalScore[winID] || 0) + defultwin; //รวมคะแนน 
      this.totalScore[loseID] = (this.totalScore[loseID] || 0) + defultlose;



      const updatescoreurl = 'https://backend-projectanidex.onrender.com/anidexvote/updatescore/' + winID;
      const scoreData = { score: this.totalScore[winID] };
      this.http.put(updatescoreurl, scoreData).subscribe(
        (response) => {
          console.log('Score updated successfully:', response);
        },
        (error) => {
          console.error('Error updating score:', error);
        }
      );

      // สร้าง URL สำหรับอัปเดตคะแนนโดยใช้ PID (ไอดีของรูปภาพที่แพ้)
      const updatescoreurllose = 'https://backend-projectanidex.onrender.com/anidexvote/updatescore/' + loseID;

      // สร้างข้อมูลที่จะส่งไปยังเซิร์ฟเวอร์ (ในที่นี้คือคะแนนที่ต้องการอัปเดต)
      const scoreDatalose = { score: this.totalScore[loseID] };

      // ส่งคำขอ PUT โดยใช้ HttpClient
      this.http.put(updatescoreurllose, scoreDatalose).subscribe(
        (response) => {
          console.log('Score updated successfully:', response);
          // ทำสิ่งที่คุณต้องการหลังจากอัปเดตคะแนนสำเร็จ
        },
        (error) => {
          console.error('Error updating score:', error);
          // จัดการข้อผิดพลาดที่เกิดขึ้นในการอัปเดตคะแนน
        }
      );



      console.log(Win);
      console.log(Lose);

      Swal.fire({
        title: 'Vote Successful',
        icon: 'success',
        timer: 1000,
        timerProgressBar: true,
        backdrop: false,
        didOpen: () => {
          Swal.showLoading();
        },
        willClose: () => {
          location.reload();
        },
      });
    } catch (error) {
      console.error('Error voting:', error);
      Swal.fire({
        icon: 'error',
        title: 'Vote Failed',
        text: 'An error occurred while voting',
        backdrop: false,
      });
    }
  }


  calvote(winID: any, loseID: any, winScore: number, loseScore: number): void {
    const { winNewscore, loseNewscore } = this.calculateElo(winScore, loseScore); // เรียกใช้ calculateElo เพื่อคำนวณคะแนนใหม่

    const defultwin = winNewscore - winScore;
    const defultlose = loseNewscore - winScore;


    this.vote(winID, loseID, defultwin, defultlose); // เรียกใช้ vote เพื่อส่งคะแนนใหม่ไปยังเซิร์ฟเวอร์
  }


  //รับ winscore,losescore และ ส่ง winNewscore, loseNewscore กลับไป
  calculateElo(winScore: number, loseScore: number): { winNewscore: number, loseNewscore: number } {
    const k_FACTOR = 32;

    const winerExpectedScore = 1 / (1 + Math.pow(10, (loseScore - winScore) / 400)); //หาค่าความคาดหวัง win
    const loserExpectedScore = 1 / (1 + Math.pow(10, (winScore - loseScore) / 400)); //หาค่าความคาดหวัง lose

    let winNewscore = winScore + k_FACTOR * (1 - winerExpectedScore); //คะแนน win ใหม่
    let loseNewscore = loseScore - k_FACTOR * (0 - loserExpectedScore);


    if (winNewscore < 0) {
      winNewscore = 0;
    }
    if (loseNewscore < 0) {
      loseNewscore = 0;
    }



    console.log("WinnerCal: " + winScore + " + " + k_FACTOR + " * (1 - " + winerExpectedScore + ")");
    console.log("LoserCal: " + loseScore + " + " + k_FACTOR + " * (0 - " + loserExpectedScore + ")");

    console.log("WinnerNewScore:", winNewscore);
    console.log("LoserNewScore:", loseNewscore);


    return { winNewscore, loseNewscore }
  }




  calscore() {
    this.totalScore = {};

    this.imageUrl.forEach((item) => {
      this.totalScore[item.pid] = (this.totalScore[item.pid] || 0) + item.score;
    })

    console.log(this.totalScore);
  }
}


