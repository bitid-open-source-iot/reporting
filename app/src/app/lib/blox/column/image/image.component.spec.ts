import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BloxColumnImageComponent } from './image.component';

describe('BloxColumnImageComponent', () => {
  let component: BloxColumnImageComponent;
  let fixture: ComponentFixture<BloxColumnImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BloxColumnImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BloxColumnImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
