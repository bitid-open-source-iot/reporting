import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BloxFilterComponent } from './filter.component';

describe('BloxFilterComponent', () => {
  let component: BloxFilterComponent;
  let fixture: ComponentFixture<BloxFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BloxFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BloxFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
