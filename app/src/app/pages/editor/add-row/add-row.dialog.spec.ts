import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRowDialog } from './add-row.dialog';

describe('AddRowDialog', () => {
  let component: AddRowDialog;
  let fixture: ComponentFixture<AddRowDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRowDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRowDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
