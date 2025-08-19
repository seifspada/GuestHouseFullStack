import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodCardUserComponent } from './food-card-user.component';

describe('FoodCardUserComponent', () => {
  let component: FoodCardUserComponent;
  let fixture: ComponentFixture<FoodCardUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoodCardUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FoodCardUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
