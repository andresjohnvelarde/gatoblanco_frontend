import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosUser } from './usuarios-user';

describe('UsuariosUser', () => {
  let component: UsuariosUser;
  let fixture: ComponentFixture<UsuariosUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuariosUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuariosUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
