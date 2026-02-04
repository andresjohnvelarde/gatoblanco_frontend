import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEliminar } from './modal-eliminar';

describe('ModalEliminar', () => {
  let component: ModalEliminar;
  let fixture: ComponentFixture<ModalEliminar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEliminar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEliminar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
