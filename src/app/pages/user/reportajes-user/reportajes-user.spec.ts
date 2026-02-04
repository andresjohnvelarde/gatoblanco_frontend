import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportajesUser } from './reportajes-user';

describe('ReportajesUser', () => {
  let component: ReportajesUser;
  let fixture: ComponentFixture<ReportajesUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportajesUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportajesUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
