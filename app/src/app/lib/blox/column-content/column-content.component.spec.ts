import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BloxColumnContentComponent } from './column-content.component';

describe('BloxColumnContentComponent', () => {
  let component: BloxColumnContentComponent;
  let fixture: ComponentFixture<BloxColumnContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BloxColumnContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BloxColumnContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
