import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BloxColumnTextComponent } from './text.component';

describe('BloxColumnTextComponent', () => {
  let component: BloxColumnTextComponent;
  let fixture: ComponentFixture<BloxColumnTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BloxColumnTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BloxColumnTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
