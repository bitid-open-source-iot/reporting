import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BloxColumnValueComponent } from './value.component';

describe('BloxColumnValueComponent', () => {
  let component: BloxColumnValueComponent;
  let fixture: ComponentFixture<BloxColumnValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BloxColumnValueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BloxColumnValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
