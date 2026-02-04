import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreado } from './modal-creado';

describe('ModalCreado', () => {
  let component: ModalCreado;
  let fixture: ComponentFixture<ModalCreado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCreado]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCreado);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
