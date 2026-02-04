import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../../auth/auth-service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar-user',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar-user.html',
  styleUrl: './sidebar-user.css',
})
export class SidebarUser implements OnInit {
  @Input() isOpen: boolean = false;
  @Output() closeSidebar = new EventEmitter<void>();
  @Output() toggleSidebar = new EventEmitter<void>(); // Nuevo evento

  userRole: string | null = null;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.userRole = this.authService.getRole();
  }

  // Se dispara al dar clic en la hamburguesa
  onToggle() {
    this.toggleSidebar.emit();
  }

  // Se dispara al dar clic en un link (para cerrar en móvil)
  onLinkClick() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // O 'auto' si prefieres que el salto sea instantáneo
    });

    if (window.innerWidth <= 970) {
      this.closeSidebar.emit();
    }
  }
}
