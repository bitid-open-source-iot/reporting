import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BloxColumnChartComponent } from './chart.component';

describe('BloxColumnChartComponent', () => {
  let component: BloxColumnChartComponent;
  let fixture: ComponentFixture<BloxColumnChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BloxColumnChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BloxColumnChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
