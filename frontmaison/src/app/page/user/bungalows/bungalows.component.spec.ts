import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BungalowsComponent } from './bungalows.component';

describe('BungalowsComponent', () => {
  let component: BungalowsComponent;
  let fixture: ComponentFixture<BungalowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BungalowsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BungalowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
