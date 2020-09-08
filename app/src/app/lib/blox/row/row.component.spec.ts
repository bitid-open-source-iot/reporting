import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BloxRowComponent } from './row.component';

describe('BloxRowComponent', () => {
  let component: BloxRowComponent;
  let fixture: ComponentFixture<BloxRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BloxRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BloxRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
