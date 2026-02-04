import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCeReportaje } from './modal-ce-reportaje';

describe('ModalCeReportaje', () => {
  let component: ModalCeReportaje;
  let fixture: ComponentFixture<ModalCeReportaje>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCeReportaje]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCeReportaje);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
