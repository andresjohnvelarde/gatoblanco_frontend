import { Component } from '@angular/core';
import { Titulo } from '../../../components/titulo/titulo';
import { ModalEliminar } from '../../../components/modal-eliminar/modal-eliminar';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MensajeService } from '../../../services/mensaje-service';

@Component({
  selector: 'app-mensajes-user',
  imports: [Titulo, ModalEliminar, CommonModule],
  templateUrl: './mensajes-user.html',
  styleUrl: './mensajes-user.css',
})
export class MensajesUser {
  mostrarModal: boolean = false;
  usuarioSeleccionado: any = null;

  mostrarModalEliminar: boolean = false;
  mensajeParaEliminar: any = null;
  // Datos de ejemplo
  mensajes: any[] = [
  ];


  constructor(private router: Router, private mensajeService: MensajeService) { }

  ngOnInit() {
    this.cargarMensajes();
  }

  cargarMensajes() {
    this.mensajeService.getMensajes().subscribe({
      next: (data) => {
        this.mensajes = data;
      },
      error: (err) => {
        console.error('Error al cargar mensajes', err);
      }
    });
  }

  // Función para abrir el modal
  abrirModalEliminar(noticia: any) {
    this.mensajeParaEliminar = noticia;
    this.mostrarModalEliminar = true;
  }

  // Función que se ejecuta al confirmar
  confirmarEliminacion() {
    if (!this.mensajeParaEliminar) return;


    const id = this.mensajeParaEliminar.idmensaje;


    this.mensajeService.deleteMensaje(id).subscribe(() => {
      this.mensajes = this.mensajes.filter(
        m => m.idmensaje !== id
      );
      this.mostrarModalEliminar = false;
      this.mensajeParaEliminar = null;
    });
  }

  previsualizar(publicacionId: number) {
    this.router.navigate(['/home-user/previsualizacion', publicacionId]);
  }

  guardarNoticia(datos: any) {
    if (this.usuarioSeleccionado) {
      // Lógica para ACTUALIZAR
      const index = this.mensajes.findIndex(n => n.id === this.usuarioSeleccionado.id);
      if (index !== -1) {
        this.mensajes[index] = { ...this.mensajes[index], ...datos };
      }
    } else {
      // Lógica para CREAR
      const nuevoUsuario = { id: Date.now(), ...datos };
      this.mensajes.unshift(nuevoUsuario); // Agregar al inicio de la lista
    }

    this.mostrarModal = false; // Cerrar al terminar
  }
}
