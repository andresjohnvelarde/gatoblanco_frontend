import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PublicacionService } from '../../../services/publicacion-service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  novedades: any[] = [];
  masVistos: any[] = [];

  apiUrl = `${environment.apiUrl}`;

  constructor(private router: Router, private publicacionService: PublicacionService) { }

  ngOnInit() {
    this.cargarRecientes();
    this.cargarMasVistos();
  }

  cargarRecientes() {
    this.publicacionService.getRecientes().subscribe({
      next: (data) => {
        this.novedades = data.map(item => ({
          ...item,
          // Por seguridad, si alguna imagen viene vacía
          img1: item.img1 ? `${this.apiUrl}/${item.img1} ` : '/images/default-noticia.jpg',
          fecha_publicacion_formateada: item.fecha_publicacion_formateada || ''
        }));
      },
      error: (err) => {
        console.error('Error al cargar noticias recientes', err);
      }
    });
  }

  cargarMasVistos() {
    this.publicacionService.getMasVistos().subscribe({
      next: (res: any[]) => {
        this.masVistos = res;
      },
      error: (err) => {
        console.error('Error al cargar los más vistos:', err);
      }
    });
  }

  irADetalle(item: any) {
    // Primero incrementar visualizaciones
    this.publicacionService.incrementarVisualizacion(item.idpublicacion).subscribe({
      next: () => {
        // Luego navegar a la página de detalle
        this.router.navigate(['/home/detalle', item.idpublicacion]);
      },
      error: (err) => {
        console.error('Error al incrementar visualización', err);
        // Igual navegar aunque falle
        this.router.navigate(['/home/detalle', item.idpublicacion]);
      }
    });
  }

  scrollToMasVistos() {
    const el = document.getElementById('mas-vistos');
    if (!el) return;

    const startY = window.pageYOffset;
    const targetY =
      el.getBoundingClientRect().top + window.pageYOffset - 120;

    const distance = targetY - startY;
    const duration = 1200; // 👈 MÁS ALTO = MÁS LENTO (ms)

    let startTime: number | null = null;

    const easeInOutCubic = (t: number) =>
      t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const animateScroll = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(progress);

      window.scrollTo(0, startY + distance * eased);

      if (elapsed < duration) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  }


}
