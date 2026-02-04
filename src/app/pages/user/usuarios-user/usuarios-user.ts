import { Component } from '@angular/core';
import { Titulo } from '../../../components/titulo/titulo';
import { Router } from '@angular/router';
import { ModalCeUsuario } from '../modal-ce-usuario/modal-ce-usuario';
import { ModalEliminar } from '../../../components/modal-eliminar/modal-eliminar';
import { CommonModule } from '@angular/common';
import { Usuario, UsuarioService } from '../../../services/usuario-service';

@Component({
  selector: 'app-usuarios-user',
  imports: [Titulo, ModalCeUsuario, ModalEliminar, CommonModule],
  templateUrl: './usuarios-user.html',
  styleUrl: './usuarios-user.css',
})
export class UsuariosUser {
  mostrarModal: boolean = false;
  usuarioSeleccionado: any = null;

  mostrarModalEliminar: boolean = false;
  noticiaParaEliminar: any = null;
  // Datos de ejemplo
  usuarios: Usuario[] = [];

  constructor(private router: Router, private usuariosService: UsuarioService) { }

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuariosService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        // Podrías redirigir al login si es 401
      }
    });
  }

  abrirModalCrear() {
    this.usuarioSeleccionado = null; // Aseguramos que el formulario esté vacío
    this.mostrarModal = true;
  }

  abrirModalEditar(noticia: any) {
    this.usuarioSeleccionado = { ...noticia }; // Pasamos una copia para no editar la tabla en tiempo real
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

    const id = this.noticiaParaEliminar.idusuario;

    this.usuariosService.deleteUsuario(id).subscribe({
      next: () => {
        // 🔥 eliminar del array local (más rápido que volver a cargar)
        this.usuarios = this.usuarios.filter(
          u => u.idusuario !== id
        );

        this.mostrarModalEliminar = false;
        this.noticiaParaEliminar = null;
      },
      error: (err) => {
        console.error('Error al eliminar usuario', err);
      }
    });
  }

  previsualizar(publicacionId: number) {
    this.router.navigate(['/home-user/previsualizacion', publicacionId]);
  }

  guardarUsuario(datos: any) {
    if (datos.idusuario) {
      // EDITAR
      const index = this.usuarios.findIndex(
        u => u.idusuario === datos.idusuario
      );


      if (index !== -1) {
        this.usuarios[index] = {
          ...this.usuarios[index],
          ...datos
        };
      }
    } else {
      // CREAR
      const nuevoUsuario = {
        idusuario: Date.now(), // temporal
        ...datos
      };
      this.usuarios.push(nuevoUsuario); // 👈 SIEMPRE al final
    }


    this.mostrarModal = false;
    this.usuarioSeleccionado = null; // 🔥 IMPORTANTE
  }
}
