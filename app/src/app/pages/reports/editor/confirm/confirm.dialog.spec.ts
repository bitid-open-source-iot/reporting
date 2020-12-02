import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmUpdateDialog } from './confirm.dialog';

describe('ConfirmUpdateDialog', () => {
  let component: ConfirmUpdateDialog;
  let fixture: ComponentFixture<ConfirmUpdateDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmUpdateDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmUpdateDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
