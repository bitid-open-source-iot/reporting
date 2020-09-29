import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BloxColumnBannerComponent } from './banner.component';

describe('BloxColumnBannerComponent', () => {
  let component: BloxColumnBannerComponent;
  let fixture: ComponentFixture<BloxColumnBannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BloxColumnBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BloxColumnBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
