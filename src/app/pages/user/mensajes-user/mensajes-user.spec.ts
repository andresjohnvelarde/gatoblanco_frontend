import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensajesUser } from './mensajes-user';

describe('MensajesUser', () => {
  let component: MensajesUser;
  let fixture: ComponentFixture<MensajesUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MensajesUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MensajesUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
