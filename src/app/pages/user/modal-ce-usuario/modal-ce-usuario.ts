import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario-service';

@Component({
  selector: 'app-modal-ce-usuario',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './modal-ce-usuario.html',
  styleUrl: './modal-ce-usuario.css',
})
export class ModalCeUsuario {
  @Input() usuarioParaEditar: any = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  usuarioForm!: FormGroup;
  isSubmitting = false;
  showPassword = false;
  showConfirmPassword = false;

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.initForm();
    if (this.usuarioParaEditar) {
      const { nombres, apellidos, username } = this.usuarioParaEditar;
      this.usuarioForm.patchValue({ nombres, apellidos, username });


      // Limpiamos los campos de password
      this.usuarioForm.get('password')?.setValue('');
      this.usuarioForm.get('confirmPassword')?.setValue('');
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  initForm() {
    this.usuarioForm = this.fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  async onSubmit() {
    if (this.usuarioForm.invalid) return;

    // Validación de passwords
    if (this.usuarioForm.value.password !== this.usuarioForm.value.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    this.isSubmitting = true;

    try {
      const payload = { ...this.usuarioForm.value };
      delete payload.confirmPassword;

      if (this.usuarioParaEditar) {
        // EDITAR
        this.usuarioService.updateUsuario(this.usuarioParaEditar.idusuario, payload).subscribe();
        alert('Usuario actualizado correctamente');
      } else {
        // CREAR
        this.usuarioService.createUsuario(payload).subscribe();
        alert('Usuario creado correctamente');
      }

      this.save.emit({
        ...payload,
        idusuario: this.usuarioParaEditar?.idusuario ?? null
      });
      this.close.emit();
    } catch (err: any) {
      console.error('Error en el envío:', err);
      alert(err.error?.message || 'Ocurrió un error');
    } finally {
      this.isSubmitting = false;
    }
  }
}
