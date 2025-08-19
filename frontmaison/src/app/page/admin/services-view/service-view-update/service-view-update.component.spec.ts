import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceViewUpdateComponent } from './service-view-update.component';

describe('ServiceViewUpdateComponent', () => {
  let component: ServiceViewUpdateComponent;
  let fixture: ComponentFixture<ServiceViewUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceViewUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceViewUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
