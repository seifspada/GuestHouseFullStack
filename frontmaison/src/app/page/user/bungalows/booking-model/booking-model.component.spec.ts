import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingModelComponent } from './booking-model.component';

describe('BookingModelComponent', () => {
  let component: BookingModelComponent;
  let fixture: ComponentFixture<BookingModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingModelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
