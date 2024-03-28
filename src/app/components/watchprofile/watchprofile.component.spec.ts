import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchprofileComponent } from './watchprofile.component';

describe('WatchprofileComponent', () => {
  let component: WatchprofileComponent;
  let fixture: ComponentFixture<WatchprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WatchprofileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WatchprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
