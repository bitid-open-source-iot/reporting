import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnSetupComponent } from './setup.component';

describe('ColumnSetupComponent', () => {
  let component: ColumnSetupComponent;
  let fixture: ComponentFixture<ColumnSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColumnSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
