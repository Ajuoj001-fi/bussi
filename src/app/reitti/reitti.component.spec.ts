import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReittiComponent } from './reitti.component';

describe('ReittiComponent', () => {
  let component: ReittiComponent;
  let fixture: ComponentFixture<ReittiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReittiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReittiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
