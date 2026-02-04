import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCeNoticia } from './modal-ce-noticia';

describe('ModalCeNoticia', () => {
  let component: ModalCeNoticia;
  let fixture: ComponentFixture<ModalCeNoticia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCeNoticia]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCeNoticia);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
