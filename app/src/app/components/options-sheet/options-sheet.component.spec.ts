import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsSheetComponent } from './options-sheet.component';

describe('OptionsSheetComponent', () => {
  let component: OptionsSheetComponent;
  let fixture: ComponentFixture<OptionsSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionsSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
