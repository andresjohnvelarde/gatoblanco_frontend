import { Component } from '@angular/core';
import { VideoService } from '../../services/video-service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-formulario-video',
  imports: [CommonModule],
  templateUrl: './formulario-video.html',
  styleUrl: './formulario-video.css',
})
export class FormularioVideo {
  selectedFile: File | null = null;
  videoUrl: string = '';
  isUploading: boolean = false;
  errorMessage: string = ''; // Nueva variable para errores
  private apiUrl = `${environment.apiUrl}`;

  private readonly MAX_SIZE_MB = 100;

  constructor(private videoService: VideoService) { }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.errorMessage = ''; // Reiniciar error
    this.videoUrl = '';     // Limpiar resultado anterior

    if (file) {
      const sizeInMB = file.size / (1024 * 1024);

      if (sizeInMB > this.MAX_SIZE_MB) {
        this.errorMessage = `El archivo es demasiado pesado (${sizeInMB.toFixed(2)} MB). El límite es ${this.MAX_SIZE_MB} MB.`;
        this.selectedFile = null;
        event.target.value = ''; // Resetear el input file
      } else {
        this.selectedFile = file;
      }
    }
  }

  onUpload() {
    if (!this.selectedFile) return;

    this.isUploading = true;
    this.videoService.uploadVideo(this.selectedFile).subscribe({
      next: (res) => {
        // Asumiendo que ahora construyes la URL con el filename recibido
        this.videoUrl = `${this.apiUrl}/api/video/stream/${res.filename}`;
        this.isUploading = false;
        this.selectedFile = null;
      },
      error: (err) => {
        this.errorMessage = 'Error en el servidor al procesar el video.';
        this.isUploading = false;
      }
    });
  }
}
