import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Reportajes } from './reportajes';

describe('Reportajes', () => {
  let component: Reportajes;
  let fixture: ComponentFixture<Reportajes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Reportajes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Reportajes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
