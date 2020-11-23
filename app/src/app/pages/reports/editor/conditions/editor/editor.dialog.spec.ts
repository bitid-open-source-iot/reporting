import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionEditorDialog } from './editor.dialog';

describe('ConditionEditorDialog', () => {
  let component: ConditionEditorDialog;
  let fixture: ComponentFixture<ConditionEditorDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConditionEditorDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConditionEditorDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
