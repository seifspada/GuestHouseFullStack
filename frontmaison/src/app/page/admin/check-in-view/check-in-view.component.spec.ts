import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckInViewComponent } from './check-in-view.component';

describe('CheckInViewComponent', () => {
  let component: CheckInViewComponent;
  let fixture: ComponentFixture<CheckInViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckInViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckInViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
