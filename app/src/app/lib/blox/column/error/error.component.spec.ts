import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BloxColumnErrorComponent } from './error.component';

describe('BloxColumnErrorComponent', () => {
  let component: BloxColumnErrorComponent;
  let fixture: ComponentFixture<BloxColumnErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BloxColumnErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BloxColumnErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
