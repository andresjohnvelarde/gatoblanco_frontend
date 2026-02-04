import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PublicacionService } from '../../../services/publicacion-service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-detalle',
  imports: [CommonModule],
  templateUrl: './detalle.html',
  styleUrl: './detalle.css',
})
export class Detalle implements OnInit {
  apiUrl = environment.apiUrl;
  publicacion: any = null;

  constructor(private route: ActivatedRoute, private publicacionService: PublicacionService) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.cargarPublicacion(id);
    }
  }

  cargarPublicacion(id: number) {
    this.publicacionService.getPublicacionPorId(id).subscribe({
      next: (data) => {
        // URL imagen principal
        data.img1Url = data.img1
          ? `${this.apiUrl}/${data.img1}`
          : null;

        // Normalizar bloques
        data.bloques = (data.bloques || []).map((b: any) => ({
          ...b,
          urlCompleta:
            b.tipo === 'imagen'
              ? `${this.apiUrl}/${b.url}`
              : b.tipo === 'video'
                ? `${this.apiUrl}/api/video/stream/${b.url}`
                : null
        }));

        // Normalizar autorías
        data.autorias = (data.autorias || []).map((a: any) => ({
          ...a,
          urlCompleta: `${this.apiUrl}/${a.url}`
        }));

        this.publicacion = data;
      },
      error: err => console.error(err)
    });
  }
}
