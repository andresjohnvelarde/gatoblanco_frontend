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
}
