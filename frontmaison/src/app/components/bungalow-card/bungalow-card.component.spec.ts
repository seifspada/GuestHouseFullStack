import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BungalowCardComponent } from './bungalow-card.component';

describe('BungalowCardComponent', () => {
  let component: BungalowCardComponent;
  let fixture: ComponentFixture<BungalowCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BungalowCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BungalowCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
