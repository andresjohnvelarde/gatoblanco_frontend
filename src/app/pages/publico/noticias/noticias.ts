import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PublicacionService } from '../../../services/publicacion-service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-noticias',
  imports: [CommonModule],
  templateUrl: './noticias.html',
  styleUrl: './noticias.css',
})
export class Noticias implements OnInit {
  apiUrl = `${environment.apiUrl}`;
  // Simulación de 80 noticias para tener 10 páginas (8 por página)
  todasLasNoticias: any[] = [];

  noticiasPaginadas: any[] = [];
  paginaActual: number = 1;
  itemsPorPagina: number = 8;
  totalPaginas: number = 0;

  constructor(private router: Router, private publicacionesService: PublicacionService) { }

  ngOnInit(): void {
    this.cargarNoticias();
    this.totalPaginas = Math.ceil(this.todasLasNoticias.length / this.itemsPorPagina);

    this.actualizarPagina();
  }

  cargarNoticias() {
    this.publicacionesService.getPublicaciones('noticia').subscribe({
      next: (data) => {
        // Transformamos los datos del backend al formato esperado por la vista
        this.todasLasNoticias = data.map(n => ({
          id: n.idpublicacion,
          img: this.apiUrl + '/' + n.img1, // Usamos la primera imagen
          fecha: n.fecha_publicacion_formateada,
          titulo: n.titulo,
          desc: n.descripcion
        }));


        this.totalPaginas = Math.ceil(this.todasLasNoticias.length / this.itemsPorPagina);
        this.actualizarPagina();
      },
      error: (err) => {
        console.error('Error cargando noticias:', err);
      }
    });
  }

  irADetalle(item: any) {
    // Primero incrementar visualizaciones
    this.publicacionesService.incrementarVisualizacion(item.id).subscribe({
      next: () => {
        // Luego navegar a la página de detalle
        this.router.navigate(['/home/detalle', item.id]);
      },
      error: (err) => {
        console.error('Error al incrementar visualización', err);
        // Igual navegar aunque falle
        this.router.navigate(['/home/detalle', item.id]);
      }
    });
  }

  actualizarPagina() {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.noticiasPaginadas = this.todasLasNoticias.slice(inicio, fin);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cambiarPagina(p: number | string) {
    if (typeof p === 'number' && p > 0 && p <= this.totalPaginas) {
      this.paginaActual = p;
      this.actualizarPagina();
    }
  }

  // Lógica para generar el array de números y puntos suspensivos
  get paginasVisibles() {
    const paginas = new Set<number>();
    const total = this.totalPaginas;
    const actual = this.paginaActual;
    // REGLA 1: Siempre mostrar 1 y 2
    paginas.add(1);
    if (total >= 2) paginas.add(2);

    // REGLA 2: Siempre mostrar penúltima y última
    if (total >= 3) paginas.add(total);
    if (total >= 4) paginas.add(total);

    // REGLA 3: Mostrar Anterior, Actual y Siguiente
    if (actual > 1) paginas.add(actual - 1);
    paginas.add(actual);
    if (actual < total) paginas.add(actual + 1);

    // Convertir el Set a un array ordenado
    const paginasOrdenadas = Array.from(paginas).sort((a, b) => a - b);

    // REGLA 4: Insertar puntos suspensivos donde haya saltos
    const resultado: any[] = [];
    for (let i = 0; i < paginasOrdenadas.length; i++) {
      if (i > 0) {
        if (paginasOrdenadas[i] - paginasOrdenadas[i - 1] === 2) {
          // Si el salto es de solo un número (ej. de 2 a 4), añadimos el número faltante
          resultado.push(paginasOrdenadas[i] - 1);
        } else if (paginasOrdenadas[i] - paginasOrdenadas[i - 1] > 2) {
          // Si el salto es mayor, añadimos puntos suspensivos
          resultado.push('...');
        }
      }
      resultado.push(paginasOrdenadas[i]);
    }
    return resultado;
  }
}
