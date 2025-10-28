import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Redefinir } from './redefinir';

describe('Redefinir', () => {
  let component: Redefinir;
  let fixture: ComponentFixture<Redefinir>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Redefinir ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Redefinir);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
