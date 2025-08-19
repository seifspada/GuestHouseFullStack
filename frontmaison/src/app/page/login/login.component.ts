import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserRegister, LoginModel } from '../../Model/user.model';
import {jwtDecode} from 'jwt-decode'

// ✅ Interface pour décoder le JWT

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgClass, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  activeForm: string = 'Login';

  registerObj: UserRegister = {
    email: '',
    name: '',
    password: '',
    dateNaissance: undefined,
    address: '',
    telephone: '',
    role: undefined
  };

  loginObj: LoginModel = {
    email: '',
    password: ''
  };

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  changeView(formName: string) {
    this.activeForm = formName;
  }

  onRegister() {
    console.log('Register payload:', this.registerObj);

    if (!this.registerObj.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.registerObj.email)) {
      alert('Please enter a valid email address');
      return;
    }

    this.userService.registerUser(this.registerObj).subscribe({
      next: (res: UserRegister) => {
        console.log('Register response:', res);
        alert('User Registration Success');
        this.activeForm = 'Login';
      },
      error: (error) => {
        console.error('Registration error:', error);
        alert(error.error?.message || 'Registration Failed');
      }
    });
  }
onLogin() {
  console.log('Login payload:', this.loginObj);

  this.userService.onLogin(this.loginObj).subscribe({
    next: (res: any) => {
      console.log('Login successful, response:', res);

      const token = res.accessToken;
      if (!token) {
        alert('Login failed: accessToken is missing.');
        return;
      }

      // Get the current user from UserService
      const user = this.userService.getCurrentUser();
      if (!user || !user.role) {
        alert('Login failed: user or role is missing.');
        return;
      }

      // Redirect based on role
      switch (user.role.toUpperCase()) {
        case 'ADMIN':
          this.router.navigate(['/admin/overview']);
          break;
        case 'RESPONSABLE':
          this.router.navigate(['/responsable']);
          break;
        case 'USER':
          this.router.navigate(['/home']);
          break;
        default:
          this.router.navigate(['/login']);
          break;
      }
    },
    error: (err) => {
      console.error('Login error:', err);
      alert('Wrong Credentials');
    }
  });
}
}


  /*
  onLogin() {
    console.log('Login payload:', this.loginObj);
    this.userService.onLogin(this.loginObj).subscribe({
      next: (res: UserRegister) => {
        console.log('Login response:', res);
        alert('User Navigating inside');
        this.router.navigateByUrl('/home');
      },
      error: (error) => {
        console.error('Login error:', error);
        alert('Wrong Credentials');
      }
    });
  }

  */
