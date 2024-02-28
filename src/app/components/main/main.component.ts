import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
@Component({
  selector: 'app-main',
  standalone: true,
  imports: [MatToolbarModule,RouterLink,MatButtonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

}
