import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Getuserjoinimg, UserGetRespon } from '../../../../model/UserGetRespon';
import { Chart } from 'chart.js/auto';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ImageGetRespon, Sevendaybefore } from '../../../../model/ImageGetRespon';


@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [RouterLink, CommonModule, MatButtonModule, HttpClientModule],
  templateUrl: './graph.component.html',
  styleUrl: './graph.component.scss'
})
export class GraphComponent implements OnInit {
  userdata: UserGetRespon[] = [];
  user: UserGetRespon | undefined;
  flag: boolean = false;

  pid: any;
  imageData: ImageGetRespon[] = [];
  sevendayData: Sevendaybefore[] = []
  userdatapid: Getuserjoinimg[] = [];


  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.pid = params['pid'];

      this.imagePidData(this.pid);
      this.sevendayforgraph(this.pid);
      this.getuserbyPid(this.pid);



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
            this.flag = true;
          });
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        console.log('No token found in localStorage');
        this.flag = false;
      }
    });
  }


  imagePidData(pid: number): void {
    const url = `https://backend-projectanidex.onrender.com/image/${pid}`;
    this.http.get<ImageGetRespon[]>(url).subscribe((data: ImageGetRespon[]): void => {
      if (data && data.length > 0) {
        this.imageData = data;
      } else {
        console.log('No image data found');
      }
    });
  }


  sevendayforgraph(pid: number): void {
    const sevendayurl = `https://backend-projectanidex.onrender.com/nowscore/sevenday_before/${pid}`;
    this.http.get(sevendayurl).subscribe(
      (data: any) => {
        this.sevendayData = data;
        console.log(this.sevendayData);
        this.graphgen();
      },
      (error) => {
        console.log(error);
      }
    );
  }


  graphgen() {
    const labels = this.sevendayData.map((entry) => entry.voting_day);
    const scores = this.sevendayData.map((entry) => entry.total_score_last_7_days);

    new Chart("myChart", {
      type: 'line',
      data: {
        labels: labels,
        datasets:
          [{
            label: 'สถิติคะแนนขึ้นลงภายใน 7 วัน',
            data: scores,
            borderWidth: 1
          }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }


  getuserbyPid(pid: number): void {
    const getuserbyUid = `https://backend-projectanidex.onrender.com/user/watchprofilepid/${pid}`;
    this.http.get(getuserbyUid).subscribe(
      (data: any) => {
        this.userdatapid = data;
        console.log(this.userdatapid);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
