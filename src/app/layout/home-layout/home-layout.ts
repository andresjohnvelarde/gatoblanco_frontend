import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-home-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, RouterLinkActive, Footer],
  templateUrl: './home-layout.html',
  styleUrl: './home-layout.css',
})
export class HomeLayout {
  isMenuOpen = false;


}
