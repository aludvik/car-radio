import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationTunerComponent } from './station-tuner.component';

describe('StationTunerComponent', () => {
  let component: StationTunerComponent;
  let fixture: ComponentFixture<StationTunerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StationTunerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StationTunerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
