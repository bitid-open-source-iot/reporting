import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextForm } from './text-form.component';

describe('TextForm', () => {
  let component: TextForm;
  let fixture: ComponentFixture<TextForm>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextForm ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
