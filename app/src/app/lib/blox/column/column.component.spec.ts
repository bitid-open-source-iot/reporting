import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BloxColumnComponent } from './column.component';

describe('BloxColumnComponent', () => {
  let component: BloxColumnComponent;
  let fixture: ComponentFixture<BloxColumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BloxColumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BloxColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
