import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BloxComponent } from './blox.component';

describe('BloxComponent', () => {
  let component: BloxComponent;
  let fixture: ComponentFixture<BloxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BloxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BloxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
