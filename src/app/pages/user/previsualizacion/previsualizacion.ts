import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { PublicacionService } from '../../../services/publicacion-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-previsualizacion',
  imports: [CommonModule],
  templateUrl: './previsualizacion.html',
  styleUrl: './previsualizacion.css',
})
export class Previsualizacion implements OnInit {
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
    this.publicacionService.listarAdminPublicacionId(id).subscribe({
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

  // Determina si, tras la rotación, la imagen se verá verticalmente larga
  esVerticalVisual(b: any): boolean {
    // Convertimos a número explícitamente
    const ancho = Number(b.ancho);
    const alto = Number(b.alto);
    const rotacion = Number(b.rotacion);

    const estaGira90 = (rotacion == 90 || rotacion == 270);
    const esOriginalAlta = alto > ancho;

    // Si es alta y no gira, es vertical. 
    // Si es ancha y gira 90, se vuelve vertical.
    return (!estaGira90 && esOriginalAlta) || (estaGira90 && !esOriginalAlta);
  }

  getMaxWidth(b: any): string {
    // Convertimos a número explícitamente
    const ancho = Number(b.ancho);
    const alto = Number(b.alto);
    const rotacion = Number(b.rotacion);

    const estaGira90 = (rotacion == 90 || rotacion == 270);
    const esOriginalAncha = ancho >= alto;

    // CASO 3: Original ancha + Gira 90 (Se comporta como Caso 2 visualmente)
    if (estaGira90 && esOriginalAncha) return '450px';

    // CASO 2: Original alta + 0 grados
    if (!estaGira90 && !esOriginalAncha) return 'auto';

    return '100%';
  }

  getMaxHeight(b: any): string {
    const ancho = Number(b.ancho);
    const alto = Number(b.alto);
    const rotacion = Number(b.rotacion);

    const estaGira90 = (rotacion == 90 || rotacion == 270);
    const esOriginalAncha = ancho >= alto;

    // CASO 3 y 2: El límite debe estar en el ancho visual o alto real
    if (!estaGira90 && !esOriginalAncha) return '450px';
    if (estaGira90 && esOriginalAncha) return '100%';

    // CASO 1: Ancha a 0 grados
    if (!estaGira90 && esOriginalAncha) return '450px';

    // CASO 4: Alta a 90 grados (Se vuelve ancha visualmente)
    return '450px';
  }
}
