import { ComponentFixture, TestBed } from '@angular/core/testing';
import {BungalowViewComponent} from './bungalows-view.component'

describe('BungalowsViewComponent', () => {
  let component: BungalowViewComponent;
  let fixture: ComponentFixture<BungalowViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BungalowViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BungalowViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
