import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodViewUpdateComponent } from './food-view-update.component';

describe('FoodViewUpdateComponent', () => {
  let component: FoodViewUpdateComponent;
  let fixture: ComponentFixture<FoodViewUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoodViewUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FoodViewUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
