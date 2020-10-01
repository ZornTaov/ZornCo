import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoolGameComponent } from './pool-game.component';

describe('PoolGameComponent', () => {
  let component: PoolGameComponent;
  let fixture: ComponentFixture<PoolGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoolGameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoolGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
