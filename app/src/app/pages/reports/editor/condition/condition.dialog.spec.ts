import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionDialog } from './condition.dialog';

describe('ConditionDialog', () => {
  let component: ConditionDialog;
  let fixture: ComponentFixture<ConditionDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConditionDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConditionDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
