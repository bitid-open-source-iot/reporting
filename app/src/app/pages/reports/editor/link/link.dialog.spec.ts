import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkWidgetDialog } from './link.dialog';

describe('LinkWidgetDialog', () => {
  let component: LinkWidgetDialog;
  let fixture: ComponentFixture<LinkWidgetDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkWidgetDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkWidgetDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
