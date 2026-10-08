import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeLab } from './home-lab';

describe('HomeLab', () => {
  let component: HomeLab;
  let fixture: ComponentFixture<HomeLab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeLab],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeLab);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
