import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BungalowDetailComponent } from './bungalow-detail.component';

describe('BungalowDetailComponent', () => {
  let component: BungalowDetailComponent;
  let fixture: ComponentFixture<BungalowDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BungalowDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BungalowDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
