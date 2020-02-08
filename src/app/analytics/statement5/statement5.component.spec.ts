import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Statement5Component } from './statement5.component';

describe('Statement5Component', () => {
  let component: Statement5Component;
  let fixture: ComponentFixture<Statement5Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Statement5Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Statement5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
