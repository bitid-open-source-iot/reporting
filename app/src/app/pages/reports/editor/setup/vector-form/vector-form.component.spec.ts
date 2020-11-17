import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VectorForm } from './vector-form.component';

describe('VectorForm', () => {
  let component: VectorForm;
  let fixture: ComponentFixture<VectorForm>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VectorForm ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VectorForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
