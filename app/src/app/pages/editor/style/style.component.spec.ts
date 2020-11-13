import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnStyleComponent } from './style.component';

describe('ColumnStyleComponent', () => {
  let component: ColumnStyleComponent;
  let fixture: ComponentFixture<ColumnStyleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColumnStyleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
