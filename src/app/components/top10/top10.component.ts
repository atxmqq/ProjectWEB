import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-top10',
  standalone: true,
  imports: [RouterLink,MatButtonModule],
  templateUrl: './top10.component.html',
  styleUrl: './top10.component.scss'
})
export class Top10Component {

}
