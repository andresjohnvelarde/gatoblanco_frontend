import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-error',
  imports: [],
  templateUrl: './modal-error.html',
  styleUrl: './modal-error.css',
})
export class ModalError {
  @Input() preMensaje: string = '';
  @Input() objetoNombre: string = '';
  @Input() sufMensaje: string = '';

  // Eventos para comunicar al padre
  @Output() alConfirmar = new EventEmitter<void>();
  @Output() alCancelar = new EventEmitter<void>();

  confirmar() {
    this.alConfirmar.emit();
  }
}
