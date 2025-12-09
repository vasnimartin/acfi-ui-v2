import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PastorsWelcomeComponent } from './pastors-welcome.component';

describe('PastorsWelcomeComponent', () => {
  let component: PastorsWelcomeComponent;
  let fixture: ComponentFixture<PastorsWelcomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PastorsWelcomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PastorsWelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
