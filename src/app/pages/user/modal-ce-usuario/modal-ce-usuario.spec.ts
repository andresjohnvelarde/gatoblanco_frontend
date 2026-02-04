import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCeUsuario } from './modal-ce-usuario';

describe('ModalCeUsuario', () => {
  let component: ModalCeUsuario;
  let fixture: ComponentFixture<ModalCeUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCeUsuario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCeUsuario);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
