import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-eliminar',
  imports: [],
  templateUrl: './modal-eliminar.html',
  styleUrl: './modal-eliminar.css',
})
export class ModalEliminar {
  @Input() preMensaje: string = '';
  @Input() objetoNombre: string = '';
  @Input() sufMensaje: string = '';

  // Eventos para comunicar al padre
  @Output() alConfirmar = new EventEmitter<void>();
  @Output() alCancelar = new EventEmitter<void>();

  confirmar() {
    this.alConfirmar.emit();
  }

  cancelar() {
    this.alCancelar.emit();
  }
}
