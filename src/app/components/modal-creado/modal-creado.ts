import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-creado',
  imports: [],
  templateUrl: './modal-creado.html',
  styleUrl: './modal-creado.css',
})
export class ModalCreado {
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
