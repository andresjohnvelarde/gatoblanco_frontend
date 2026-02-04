import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeUserLayout } from './home-user-layout';

describe('HomeUserLayout', () => {
  let component: HomeUserLayout;
  let fixture: ComponentFixture<HomeUserLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeUserLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeUserLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
