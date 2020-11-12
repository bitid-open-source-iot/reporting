import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportEditorPage } from './editor.page';

describe('ReportEditorPage', () => {
  let component: ReportEditorPage;
  let fixture: ComponentFixture<ReportEditorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportEditorPage ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportEditorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
