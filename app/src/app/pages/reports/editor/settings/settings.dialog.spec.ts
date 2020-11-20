import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSettingsDialog } from './settings.dialog';

describe('ReportSettingsDialog', () => {
  let component: ReportSettingsDialog;
  let fixture: ComponentFixture<ReportSettingsDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportSettingsDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportSettingsDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
