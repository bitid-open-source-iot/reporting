import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetBannerComponent } from './banner.component';

describe('WidgetBannerComponent', () => {
  let component: WidgetBannerComponent;
  let fixture: ComponentFixture<WidgetBannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
