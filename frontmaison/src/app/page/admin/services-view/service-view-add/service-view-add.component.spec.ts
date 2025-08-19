import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceViewAddComponent } from './service-view-add.component';

describe('ServiceViewAddComponent', () => {
  let component: ServiceViewAddComponent;
  let fixture: ComponentFixture<ServiceViewAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceViewAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceViewAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
