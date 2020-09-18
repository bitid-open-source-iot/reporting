import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDatesDialog } from './custom-dates.dialog';

describe('CustomDatesDialog', () => {
  let component: CustomDatesDialog;
  let fixture: ComponentFixture<CustomDatesDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomDatesDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomDatesDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
