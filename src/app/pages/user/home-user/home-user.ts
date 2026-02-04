import { Component } from '@angular/core';
import { Titulo } from '../../../components/titulo/titulo';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalCeNoticia } from '../modal-ce-noticia/modal-ce-noticia';
import { Router } from '@angular/router';
import { ModalEliminar } from '../../../components/modal-eliminar/modal-eliminar';
import { PublicacionService } from '../../../services/publicacion-service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-home-user',
  imports: [Titulo, CommonModule, FormsModule, ModalCeNoticia, ModalEliminar],
  templateUrl: './home-user.html',
  styleUrl: './home-user.css',
})
export class HomeUser {
  apiUrl = `${environment.apiUrl}`;

  mostrarModal: boolean = false;
  noticiaSeleccionada: any = null;

  mostrarModalEliminar: boolean = false;
  noticiaParaEliminar: any = null;

  noticias: any[] = [];
  cargando = false;

  filtro: string = '';
  paginaActual: number = 1;
  itemsPorPagina: number = 5;

  constructor(
    private router: Router,
    private publicacionService: PublicacionService,
  ) { }

  ngOnInit() {
    this.cargarNoticias();
  }

  cargarNoticias() {
    this.cargando = true;

    this.publicacionService.listarAdmin('noticia').subscribe({
      next: (data) => {
        this.noticias = data.map(n => ({
          id: n.idpublicacion,
          titulo: n.titulo,
          descripcion: n.descripcion,
          img1: n.img1, // Cambia 'imagen' por 'imagen1' para ser consistente
          link_twitter: n.link_twitter,
          estado: n.estado,
          fecha_publicacion: n.fecha_publicacion,
          fecha_publicacion_formateada: n.fecha_publicacion_formateada,
          bloques: n.bloques
        }));
        this.cargando = false;
        console.log(data)

      },
      error: (err) => {
        console.error('Error al cargar noticias', err);
        this.cargando = false;
      }
    });

  }

  recargarNoticias() {
    this.cargarNoticias();
    this.mostrarModal = false
  }

  abrirModalCrear() {
    this.noticiaSeleccionada = null; // Aseguramos que el formulario esté vacío
    this.mostrarModal = true;
  }

  abrirModalEditar(noticia: any) {
    this.noticiaSeleccionada = { ...noticia }; // Pasamos una copia para no editar la tabla en tiempo real

    this.mostrarModal = true;
  }

  // Función para abrir el modal
  abrirModalEliminar(noticia: any) {
    this.noticiaParaEliminar = noticia;
    this.mostrarModalEliminar = true;
  }

  // Función que se ejecuta al confirmar
  confirmarEliminacion() {
    if (!this.noticiaParaEliminar) return;

    this.publicacionService.eliminar(this.noticiaParaEliminar.id)
      .subscribe({
        next: () => {
          this.noticias = this.noticias.filter(
            n => n.id !== this.noticiaParaEliminar!.id
          );
          this.mostrarModalEliminar = false;
        },
        error: err => {
          console.error('Error eliminando publicación', err);
        }
      });
  }

  previsualizar(publicacionId: number) {
    this.router.navigate(['/home-user/previsualizacion', publicacionId]);
  }

  guardarNoticia(datos: any) {
    if (this.noticiaSeleccionada) {
      // Lógica para ACTUALIZAR
      const index = this.noticias.findIndex(n => n.id === this.noticiaSeleccionada.id);
      if (index !== -1) {
        this.noticias[index] = { ...this.noticias[index], ...datos };
      }
    } else {
      // Lógica para CREAR
      const imagen1 = datos.img1 ? datos.img1 + '?v=' + Date.now() : '';
      const nuevaNoticia = { id: datos.id, ...datos, imagen1 };

      this.noticias.unshift(nuevaNoticia); // Agregar al inicio de la lista
    }

    this.mostrarModal = false; // Cerrar al terminar
  }

  eliminarNoticia(id: number) {
    if (confirm('¿Estás seguro de eliminar esta noticia?')) {
      this.noticias = this.noticias.filter(n => n.id !== id);
    }
  }

  // Filtrado en tiempo real
  get noticiasFiltradas() {
    return this.noticias.filter(n =>
      n.titulo.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  // Lógica de Paginación
  get totalPaginas() {
    return Math.ceil(this.noticiasFiltradas.length / this.itemsPorPagina);
  }

  get noticiasPaginadas() {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.noticiasFiltradas.slice(inicio, inicio + this.itemsPorPagina);
  }

  get paginasVisibles() {
    const total = this.totalPaginas;
    const actual = this.paginaActual;

    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    // Lógica para 6 o más páginas
    let paginas = new Set<number>();
    paginas.add(1);
    paginas.add(total);
    paginas.add(actual);
    if (actual > 1) paginas.add(actual - 1);
    if (actual < total) paginas.add(actual + 1);

    return Array.from(paginas).sort((a, b) => a - b);
  }

  cambiarEstado(noticia: any) {
    const nuevoEstado = noticia.estado == 1 ? 0 : 1;

    this.publicacionService
      .cambiarEstado(noticia.id, nuevoEstado)
      .subscribe(() => {
        noticia.estado = nuevoEstado == 1 ? '1' : '0';
      });
  }
}
