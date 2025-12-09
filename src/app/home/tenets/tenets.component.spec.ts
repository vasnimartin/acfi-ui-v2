import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenetsComponent } from './tenets.component';

describe('TenetsComponent', () => {
  let component: TenetsComponent;
  let fixture: ComponentFixture<TenetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenetsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
