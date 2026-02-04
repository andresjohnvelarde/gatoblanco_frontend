import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-titulo',
  imports: [],
  templateUrl: './titulo.html',
  styleUrl: './titulo.css',
})
export class Titulo {
  @Input() texto!: string;
}
