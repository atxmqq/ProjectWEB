import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, HttpClientModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']

})
export class SignupComponent {
  signupObj: any = {
    "username": "",
    "email": "",
    "password": "",
    "confirmPassword": ""
  };

  constructor(private http: HttpClient, private router: Router) { }

  signUp() {
    // ตรวจสอบว่ามีการป้อนข้อมูลครบหรือไม่
    if (this.signupObj.username && this.signupObj.email && this.signupObj.password && this.signupObj.confirmPassword) {
      // ตรวจสอบว่ารหัสผ่านและยืนยันรหัสผ่านตรงกันหรือไม่
      if (this.signupObj.password !== this.signupObj.confirmPassword) {
        alert('Password และ Confirm Password ไม่ตรงกัน!!!');
        return;
      }

      // ตรวจสอบรูปแบบของอีเมล
      const emailPattern = /^[a-zA-Z0-9._%+-]+@(gmail\.com|hotmail\.com)$/; // เช็คเฉพาะ @gmail.com และ @hotmail.com
      if (!emailPattern.test(this.signupObj.email)) {
        alert('โปรดใส่อีเมลให้ถูกต้อง');
        return;
      }
      // ส่งคำขอสมัครสมาชิกไปยังเซิร์ฟเวอร์
      this.http.post('https://backend-projectanidex.onrender.com/user/register', this.signupObj).subscribe((res: any) => {
        if (res.success) {
          alert('Register successful!');
          this.router.navigateByUrl('/login');
        } else {
          alert('Error: ' + res.error);
        }
      });
    } else {
      alert('กรุณากรอกข้อมูลให้ครบทุกช่อง!!!');
    }

    // เมื่อสมัครสมาชิกเสร็จสิ้น ให้นำผู้ใช้ไปยังหน้าเข้าสู่ระบบและส่งชื่อผู้ใช้ไปด้วย
    this.router.navigate(['/login'], { state: { username: this.signupObj.username } });
  }

}
