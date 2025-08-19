import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodViewComponent } from './foods-view.component';

describe('FoodViewComponent', () => {
  let component: FoodViewComponent;
  let fixture: ComponentFixture<FoodViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoodViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FoodViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
