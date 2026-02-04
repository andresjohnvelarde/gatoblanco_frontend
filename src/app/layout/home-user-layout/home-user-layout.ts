import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../auth/auth-service';
import { SidebarUser } from '../sidebar-user/sidebar-user';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-home-user-layout',
  imports: [RouterOutlet, SidebarUser, Footer],
  templateUrl: './home-user-layout.html',
  styleUrl: './home-user-layout.css',
})
export class HomeUserLayout {
  userName: string = '';
  userRole: string = '';
  isSideBarOpen: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.userName = this.authService.getUserName() || 'Usuario';
    this.userRole = (this.authService.getRole() || 'Sin Rol').slice(5);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home/login']);
  }

}
