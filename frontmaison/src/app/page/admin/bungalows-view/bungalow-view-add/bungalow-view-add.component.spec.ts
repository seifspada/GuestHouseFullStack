import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BungalowViewAddComponent } from './bungalow-view-add.component';

describe('BungalowViewAddComponent', () => {
  let component: BungalowViewAddComponent;
  let fixture: ComponentFixture<BungalowViewAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BungalowViewAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BungalowViewAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
