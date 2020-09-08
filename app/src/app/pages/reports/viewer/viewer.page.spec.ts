import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportViewerPage } from './viewer.page';

describe('ReportViewerPage', () => {
  let component: ReportViewerPage;
  let fixture: ComponentFixture<ReportViewerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportViewerPage ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportViewerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
