import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { UserGetRespon } from '../../../../model/UserGetRespon';
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

  pid: any;
  imageData: ImageGetRespon[] = [];
  sevendayData: Sevendaybefore[] = []


  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.pid = params['pid'];

      this.imagePidData(this.pid);
      this.sevendayforgraph(this.pid);
    });
  }


  imagePidData(pid: number): void {
    const url = `http://localhost:3000/image/${pid}`;
    this.http.get<ImageGetRespon[]>(url).subscribe((data: ImageGetRespon[]): void => {
      if (data && data.length > 0) {
        this.imageData = data;
      } else {
        console.log('No image data found');
      }
    });
  }


  sevendayforgraph(pid: number): void {
    const sevendayurl = `http://localhost:3000/nowscore/sevenday_before/${pid}`;
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
}
