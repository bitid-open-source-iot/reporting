import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnConditionsComponent } from './conditions.component';

describe('ColumnConditionsComponent', () => {
  let component: ColumnConditionsComponent;
  let fixture: ComponentFixture<ColumnConditionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColumnConditionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
