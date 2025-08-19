import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BungalowViewUpdateComponent } from './bungalow-view-update.component';

describe('BungalowViewUpdateComponent', () => {
  let component: BungalowViewUpdateComponent;
  let fixture: ComponentFixture<BungalowViewUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BungalowViewUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BungalowViewUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
