import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodViewAddComponent } from './food-view-add.component';

describe('FoodViewAddComponent', () => {
  let component: FoodViewAddComponent;
  let fixture: ComponentFixture<FoodViewAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoodViewAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FoodViewAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
