import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnEditorDialog } from './column.dialog';

describe('ColumnEditorDialog', () => {
  let component: ColumnEditorDialog;
  let fixture: ComponentFixture<ColumnEditorDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColumnEditorDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnEditorDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
