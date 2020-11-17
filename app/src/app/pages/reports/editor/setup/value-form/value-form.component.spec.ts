import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueForm } from './value-form.component';

describe('ValueForm', () => {
  let component: ValueForm;
  let fixture: ComponentFixture<ValueForm>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValueForm ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValueForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
