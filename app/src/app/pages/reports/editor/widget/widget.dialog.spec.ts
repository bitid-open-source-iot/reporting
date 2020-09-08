import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetDialog } from './widget.dialog';

describe('WidgetDialog', () => {
  let component: WidgetDialog;
  let fixture: ComponentFixture<WidgetDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
