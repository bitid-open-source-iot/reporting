import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigorationComponent } from './configoration.component';

describe('ConfigorationComponent', () => {
  let component: ConfigorationComponent;
  let fixture: ComponentFixture<ConfigorationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigorationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigorationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
