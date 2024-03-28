import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, HttpClientModule, FormsModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginObj: any = {
    "username": "",
    "password": ""
  };

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    // เช็คว่ามีชื่อผู้ใช้ที่ส่งมาจากหน้าสมัครสมาชิกหรือไม่
    const username = history.state.username;
    if (username) {
      // เติมชื่อผู้ใช้ในช่อง username โดยอัตโนมัติ
      this.loginObj.username = username;
    }
  }

  loGin() {
    if (this.loginObj.username && this.loginObj.password) {
      console.log("Sending data:", this.loginObj); // แสดงข้อมูลที่จะถูกส่งไปยัง URL
      this.http.post('https://backend-projectanidex.onrender.com/user/login', this.loginObj).subscribe((res: any) => {
        if (res.result) { // ใช้คุณสมบัติ success ที่ได้รับเพื่อตรวจสอบ
          localStorage.setItem('token', res.token); // บันทึก token ลงใน localStorage
          this.router.navigateByUrl('/'); // เปลี่ยนเส้นทางไปยังหน้า homepage
        } else {
          alert('Username or Password is wrong!!!'); // แจ้งเตือนว่าชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง
        }
      });
    } else {
      alert('กรุณาใส่ข้อมูลให้ครบถ้วน')
    }
  }

}
