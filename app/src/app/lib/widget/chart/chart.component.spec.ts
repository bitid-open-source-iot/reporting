import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetChartComponent } from './chart.component';

describe('WidgetChartComponent', () => {
  let component: WidgetChartComponent;
  let fixture: ComponentFixture<WidgetChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
