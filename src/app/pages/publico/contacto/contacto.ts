import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MensajeService } from '../../../services/mensaje-service';
import { ModalCreado } from '../../../components/modal-creado/modal-creado';

@Component({
  selector: 'app-contacto',
  imports: [ReactiveFormsModule, CommonModule, ModalCreado],
  templateUrl: './contacto.html',
  styleUrl: './contacto.css',
})
export class Contacto implements OnInit {
  contactForm!: FormGroup;
  submitted = false;
  loading = false;
  mostrarModalCreado: boolean = false;

  constructor(private fb: FormBuilder, private mensajeService: MensajeService) { }

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      nombre: ['', Validators.required],
      celular: ['', [Validators.required]],
      asunto: ['', Validators.required],
      mensaje: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  get f() { return this.contactForm.controls; }

  confirmarAceptar() {
    this.mostrarModalCreado = false;
  }

  onSubmit() {
    this.submitted = true;

    if (this.contactForm.invalid) {
      return;
    }

    this.loading = true;

    this.mensajeService.crearMensaje(this.contactForm.value)
      .subscribe({
        next: () => {
          this.mostrarModalCreado = true;
          this.contactForm.reset();
          this.submitted = false;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          alert('Error al enviar el mensaje. Intente nuevamente.');
          this.loading = false;
        }
      });
  }
}
