import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioVideo } from './formulario-video';

describe('FormularioVideo', () => {
  let component: FormularioVideo;
  let fixture: ComponentFixture<FormularioVideo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioVideo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioVideo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
