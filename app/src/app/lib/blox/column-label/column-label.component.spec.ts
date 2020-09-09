import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BloxColumnLabelComponent } from './column-label.component';

describe('BloxColumnLabelComponent', () => {
  let component: BloxColumnLabelComponent;
  let fixture: ComponentFixture<BloxColumnLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BloxColumnLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BloxColumnLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
