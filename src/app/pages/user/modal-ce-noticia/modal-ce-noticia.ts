import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ImagenService } from '../../../services/imagen-service';
import { PublicacionService } from '../../../services/publicacion-service';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { VideoService } from '../../../services/video-service';
import { Loading } from '../../../components/loading/loading';

@Component({
  selector: 'app-modal-ce-noticia',
  imports: [ReactiveFormsModule, CommonModule, Loading],
  templateUrl: './modal-ce-noticia.html',
  styleUrl: './modal-ce-noticia.css',
})
export class ModalCeNoticia {
  @Input() noticiaParaEditar: any = null; // Si viene datos, es "Modificar"
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  noticiaForm!: FormGroup;
  isSubmitting = false;
  apiUrl = `${environment.apiUrl}`;
  isLoading: boolean = false;

  previews: { [key: string]: string | null } = {
    img1: null,
  };

  imgChanged: { [key: string]: boolean } = {
    img1: false,
  };


  //VARIABLES BLOQUES
  blockTypes = [
    { type: 'paragraph', label: 'Párrafo' },
    { type: 'image', label: 'Imagen' },
    { type: 'subtitle', label: 'Subtítulo' },
    { type: 'video', label: 'Video' }
  ];

  constructor(
    private fb: FormBuilder,
    private imagenService: ImagenService,
    private videoService: VideoService,
    private publicacionService: PublicacionService
  ) { }

  ngOnInit() {
    this.initForm();
    if (this.noticiaParaEditar?.id) {

      this.isLoading = true;
      const id = this.noticiaParaEditar.id;

      this.publicacionService
        .listarAdminPublicacionId(id)
        .subscribe((pub) => {

          // 🔹 Imagen principal
          const img1Url = pub.img1
            ? this.apiUrl + '/' + pub.img1
            : null;

          // 🔹 Patch del formulario
          this.noticiaForm.patchValue({
            titulo: pub.titulo,
            descripcion: pub.descripcion,
            fechaPublicacion: pub.fecha_publicacion,
            estado: pub.estado === '1' || pub.estado === 1,
            parrafo2: pub.parrafo2,
            parrafo3: pub.parrafo3,
            link_twitter: pub.link_twitter,
            img1: img1Url
          });

          // 🔹 Preview
          this.previews['img1'] = img1Url;

          // 🔹 Limpiar bloques actuales del form
          this.bloques.clear();

          // 🔹 Cargar bloques desde backend
          if (Array.isArray(pub.bloques)) {
            pub.bloques.forEach((block: any) => {
              this.addExistingBlock(block);
            });
          }

          // 🔹 Limpiar bloques actuales del form
          this.autorias.clear();

          // 🔹 Cargar bloques desde backend
          if (Array.isArray(pub.autorias)) {
            pub.autorias.forEach((autoria: any) => {
              this.addExistingAutoria(autoria);
            });
          }

          this.isLoading = false;
        });

    } else {
      const hoy = new Date();
      const fechaFormateada = hoy.toISOString().split('T')[0];
      this.noticiaForm.patchValue({
        fechaPublicacion: fechaFormateada
      });
    }
  }

  // 🔹 Función para agregar bloques existentes al FormArray
  addExistingBlock(block: any) {
    let group: FormGroup;

    if (block.tipo === 'parrafo') {
      group = this.fb.group({
        idbloque: [block.idbloque || null],
        type: 'paragraph',
        content: [block.texto || '', Validators.required]
      });
    } else if (block.tipo === 'subtitulo') {
      group = this.fb.group({
        idbloque: [block.idbloque || null],
        type: 'subtitle',
        content: [block.texto || '', Validators.required]
      });
    } else if (block.tipo === 'imagen') {
      group = this.fb.group({
        idbloque: [block.idbloque || null],
        type: 'image',
        file: [null],
        caption: [block.texto || ''],
        preview: [block.url ? this.apiUrl + '/' + block.url : ''],
        old_url: block.url
      });
    } else if (block.tipo === 'video') {
      group = this.fb.group({
        idbloque: [block.idbloque || null],
        type: 'video',
        file: [null],
        caption: [block.texto || ''],
        preview: [block.url ? this.apiUrl + '/api/video/stream/' + block.url : ''],
        old_url: block.url
      });
    } else {
      return; // tipo desconocido
    }

    this.bloques.push(group);
  }


  // 🔹 Función para agregar bloques existentes al FormArray
  addExistingAutoria(autoria: any) {
    let group: FormGroup;

    group = this.fb.group({
      idautoria: [autoria.idautoria || null],
      // type: 'image',
      file: [null],
      descripcion: [autoria.texto || ''],
      preview: [autoria.url ? this.apiUrl + '/' + autoria.url : ''],
      old_url: autoria.url
    });

    this.autorias.push(group);
  }

  initForm() {
    this.noticiaForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      fechaPublicacion: ['', Validators.required],
      img1: [null, Validators.required],
      link_twitter: [''],
      estado: [true],
      bloques: this.fb.array([]),
      autorias: this.fb.array([])
    });
  }

  //FUNCIONES PARA BLOQUES:
  get bloques(): FormArray {
    return this.noticiaForm.get('bloques') as FormArray;
  }

  get autorias(): FormArray {
    return this.noticiaForm.get('autorias') as FormArray;
  }

  addParagraph() {
    this.bloques.push(
      this.fb.group({
        type: 'paragraph',
        content: ['', Validators.required]
      })
    );
  }

  addImage(url: string | null) {
    this.bloques.push(this.fb.group({
      type: 'image',
      file: [null],
      caption: [''],
      preview: [''],
      url_old: url
    }));
  }

  addVideo(url: string | null) {
    this.bloques.push(this.fb.group({
      type: 'video',
      file: [null],
      caption: [''],
      preview: [''],
      url_old: url
    }));
  }

  addSubtitle() {
    this.bloques.push(
      this.fb.group({
        type: 'subtitle',
        content: ['', Validators.required]
      })
    );
  }

  removeBlock(index: number) {
    this.bloques.removeAt(index);
  }

  handleBlockFile(event: any, index: number) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.bloques.at(index).patchValue({
        file,
        preview: reader.result
      });
    };
    reader.readAsDataURL(file);
  }

  addAutoria(url: string | null) {
    this.autorias.push(this.fb.group({
      file: [null],
      descripcion: ['', Validators.required],
      preview: [''],
      url_old: url
    }));
  }

  removeAutoria(index: number) {
    this.autorias.removeAt(index);
  }

  handleAutoriaFile(event: any, index: number) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.autorias.at(index).patchValue({
        file,
        preview: reader.result
      });
    };
    reader.readAsDataURL(file);
  }

  async onSubmit() {
    if (this.noticiaForm.invalid) return;
    this.isLoading = true;

    if (this.noticiaParaEditar) {
      const oldImages: any = {};

      if (this.noticiaParaEditar) {
        oldImages.img1 = this.noticiaParaEditar.img1;
      }

      const urls: any = {};
      const imgKeys = ['img1'];

      for (const key of imgKeys) {
        const value = this.noticiaForm.get(key)?.value;
        // 👉 No cambió → conservar URL
        if (!this.imgChanged[key]) {
          urls[key] = oldImages[key]; // 👈 USAR SIEMPRE LA OLD
          continue;
        }
        // 👉 Cambió → subir nueva imagen
        if (value instanceof File) {
          const response = await lastValueFrom(
            this.imagenService.uploadImagen(value)
          );
          urls[key] = response.url;
        }
      }

      // 🔹 Preparar bloques para backend
      const bloquesPayload: any[] = [];
      for (let i = 0; i < this.bloques.length; i++) {
        const block = this.bloques.at(i).value;

        var url = block.old_url || null;
        if (block.type === 'image' && block.file) {
          const res = await lastValueFrom(this.imagenService.uploadImagen(block.file));
          url = res.url;
        }
        if (block.type === 'video' && block.file) {
          const res = await lastValueFrom(this.videoService.uploadVideo(block.file));
          url = res.url; // solo filename
        }


        bloquesPayload.push({
          idbloque: block.idbloque || null, // null = nuevo bloque
          tipo: block.type === 'image' ? 'imagen' :
            block.type === 'paragraph' ? 'parrafo' :
              block.type === 'subtitle' ? 'subtitulo' :
                'video',
          texto: (block.type === 'paragraph' || block.type === 'subtitle')
            ? block.content
            : block.caption || null,
          url,
          orden: i
        });
      }

      // 🔹 Preparar autorías para backend
      const autoriasPayload: any[] = [];
      for (let i = 0; i < this.autorias.length; i++) {
        const autoriaBlock = this.autorias.at(i).value;

        var url = autoriaBlock.old_url || null;
        if (autoriaBlock.file) {
          const res = await lastValueFrom(this.imagenService.uploadImagen(autoriaBlock.file));
          url = res.url;
        }

        autoriasPayload.push({
          idautoria: autoriaBlock.idautoria || null, // null = nuevo bloque
          texto: autoriaBlock.descripcion || null,
          url,
          orden: i
        });
      }

      const payload = {
        titulo: this.noticiaForm.value.titulo,
        descripcion: this.noticiaForm.value.descripcion,
        fecha_publicacion: this.noticiaForm.value.fechaPublicacion,
        estado: this.noticiaForm.value.estado ? 1 : 0,
        tipo: 'noticia',
        parrafo2: this.noticiaForm.value.parrafo2 || '',
        parrafo3: this.noticiaForm.value.parrafo3 || '',
        link_twitter: this.noticiaForm.value.link_twitter || '',
        img1: urls.img1,

        bloques: bloquesPayload,
        autorias: autoriasPayload
      };

      // 🔹 Llamada a backend
      this.publicacionService.editarPublicacion(payload, this.noticiaParaEditar.id)
        .subscribe({
          next: () => {
            // Actualizar local y cerrar modal
            this.save.emit({ id: this.noticiaParaEditar.id, ...payload });
            this.noticiaParaEditar = { ...this.noticiaParaEditar, ...payload };
            this.noticiaForm.patchValue({
              img1: payload.img1

            });
            this.previews['img1'] = payload.img1 || null;

            this.close.emit();
            this.isLoading = false;
          },
          error: (err) => console.error('Error al actualizar publicación', err),
          complete: () => { this.isSubmitting = false; }
        });
    }
    else {
      this.isSubmitting = true;

      try {
        const value = this.noticiaForm.get('img1')?.value;
        let img1Url = null;

        if (value instanceof File) {
          const res = await lastValueFrom(this.imagenService.uploadImagen(value));
          img1Url = res.url;
        }

        // Manejo de bloques
        const bloquesPayload: any[] = [];

        for (let i = 0; i < this.bloques.length; i++) {
          const block = this.bloques.at(i).value;

          let url = null;

          if (block.type === 'image' && block.file) {
            const res = await lastValueFrom(
              this.imagenService.uploadImagen(block.file)
            );
            url = res.url;
          }

          if (block.type === 'video' && block.file) {
            const res = await lastValueFrom(
              this.videoService.uploadVideo(block.file)
            );
            url = res.url; // 👈 SOLO filename
          }

          bloquesPayload.push({
            tipo: block.type === 'image' ? 'imagen' :
              block.type === 'paragraph' ? 'parrafo' :
                block.type === 'subtitle' ? 'subtitulo' :
                  'video',

            texto:
              block.type === 'paragraph' || block.type === 'subtitle'
                ? block.content
                : block.caption || null,
            url,
            orden: i
          });
        }

        // Manejo de autorías
        const autoriasPayload: any[] = [];

        for (let i = 0; i < this.autorias.length; i++) {
          const autoriaBlock = this.autorias.at(i).value;

          let url = null;

          if (autoriaBlock.file) {
            const res = await lastValueFrom(
              this.imagenService.uploadImagen(autoriaBlock.file)
            );
            url = res.url;
          }

          autoriasPayload.push({
            texto:
              autoriaBlock.descripcion || null,
            url,
            orden: i
          });
        }

        // 🧠 Payload final
        const payload = {
          titulo: this.noticiaForm.value.titulo,
          descripcion: this.noticiaForm.value.descripcion,
          fecha_publicacion: this.noticiaForm.value.fechaPublicacion,
          estado: this.noticiaForm.value.estado ? 1 : 0,
          tipo: 'noticia',
          link_twitter: this.noticiaForm.value.link_twitter || null,
          img1: img1Url,
          bloques: bloquesPayload,
          autorias: autoriasPayload
        };

        this.publicacionService.crearPublicacion(payload).subscribe({
          next: (response: any) => {
            this.save.emit({
              id: response.id, // ✅ ahora SÍ existe
              ...payload
            });

            this.close.emit();
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error al crear publicación', error);
          },
          complete: () => {
            this.isSubmitting = false;
          }
        });

      } catch (error) {
        console.error('Error al crear publicación', error);
      } finally {
        this.isSubmitting = false;
      }
    }
  }

  handleFileInput(event: any, field: 'img1' | 'img2' | 'img3') {
    const file = event.target.files[0];
    if (file) {
      this.noticiaForm.patchValue({ [field]: file });
      // 👇 PREVIEW
      this.previews[field] = URL.createObjectURL(file);
      // 🔥 BANDERA DE CAMBIO
      this.imgChanged[field] = true;
    }
  }

  getPreview(field: string) {
    const value = this.noticiaForm.get(field)?.value;
    if (!value) return null;
    if (typeof value === 'string') {
      // Ya es URL (caso edición)
      return value;
    }
    // Si es archivo nuevo, usamos la URL almacenada
    return this.previews[field];
  }
}