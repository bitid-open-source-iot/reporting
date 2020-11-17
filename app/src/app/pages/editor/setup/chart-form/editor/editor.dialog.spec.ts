import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeriesEditorDialog } from './editor.dialog';

describe('SeriesEditorDialog', () => {
  let component: SeriesEditorDialog;
  let fixture: ComponentFixture<SeriesEditorDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeriesEditorDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeriesEditorDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
