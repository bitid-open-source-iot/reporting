import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartForm } from './chart-form.component';

describe('ChartForm', () => {
  let component: ChartForm;
  let fixture: ComponentFixture<ChartForm>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartForm ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
