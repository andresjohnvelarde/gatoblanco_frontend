import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/auth-service';
import { ModalError } from '../../../components/modal-error/modal-error';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterLink, ModalError],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  showPassword = false;
  mostrarModalError: boolean = false;
  mensajeError: string = '';
  // Dentro de la clase...
  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    // Inicializamos el formulario con validaciones
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Getter para acceder fácilmente a los controles en el HTML
  get f() { return this.loginForm.controls; }

  confirmarAceptar() {
    this.mostrarModalError = false;
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) return;


    const { username, password } = this.loginForm.value;


    this.authService.login(username, password).subscribe({
      next: () => {
        this.router.navigate(['/home-user']);
      },
      error: (err) => {
        console.error(err);
        this.mensajeError = 'Usuario o contraseña incorrectos';
        this.mostrarModalError = true;
      }
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
