import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizRunner } from './quiz-runner';

describe('QuizRunner', () => {
  let component: QuizRunner;
  let fixture: ComponentFixture<QuizRunner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuizRunner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizRunner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
