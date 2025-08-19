import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceCardUserComponent } from './service-card-user.component';

describe('ServiceCardUserComponent', () => {
  let component: ServiceCardUserComponent;
  let fixture: ComponentFixture<ServiceCardUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceCardUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceCardUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
