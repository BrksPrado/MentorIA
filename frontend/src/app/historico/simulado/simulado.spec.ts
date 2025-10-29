import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Simulado } from './simulado';

describe('Simulado', () => {
  let component: Simulado;
  let fixture: ComponentFixture<Simulado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Simulado]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Simulado);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
