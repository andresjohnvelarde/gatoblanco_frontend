import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Previsualizacion } from './previsualizacion';

describe('Previsualizacion', () => {
  let component: Previsualizacion;
  let fixture: ComponentFixture<Previsualizacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Previsualizacion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Previsualizacion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
