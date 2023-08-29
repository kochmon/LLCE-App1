// import { Answer } from './../question';
import { Component } from '@angular/core';
import { Question } from '../question';
import { QueriesService } from '../queries.service';


@Component({
  selector: 'llce-check-fi',
  templateUrl: './check-fi.component.html',
  styleUrls: ['./check-fi.component.css']
})

export class CheckFiComponent {
  questions: Question[];
  question: Question;
  whatIsCorrect: boolean = false;
  currentQuestion: number = -1;
  popupWarning: boolean = false;
  incorrectlyAnsweredCount: number = 0;
  totalQuestions: number;
  incorrectQuestionsCheck: number = 0;
  examFailMessageCheck: boolean = false;


  constructor(private qs: QueriesService) {
    this.questions = this.qs.getAll().filter((q) => q.qtyp == 'fi');
    // antworten initialisieren
    this.questions.map((q) => { q.qtyp = 'mc';
      q.qanswers.map((a) => (a.givenanswer = false));
    });
    this.questions.map((q) => { q.qtyp = 'sc';
      q.qanswers.map((a) => (a.givenanswer = false));
    });
    this.questions.map((q) => { q.qtyp = 'fi';
      q.qgivenanswerFillIn = '';
    });
    this.questions.map((q) => { q.qtyp = 'fi';
      q.qanswers[0].givenanswer = false;
    });

    this.currentQuestion = 0;
    this.question = this.questions[this.currentQuestion];
    this.totalQuestions = this.questions.length;

  }

  toggleCorrect(ind: number) {
    if (this.currentQuestion == ind) {
      this.whatIsCorrect = !this.whatIsCorrect;
    } else {
      this.currentQuestion = ind;
      this.whatIsCorrect = true;
    }
  }

  prevQuestion() {
    if (this.currentQuestion > 0) {
      this.currentQuestion--;
      this.question = this.questions[this.currentQuestion];
    }
    this.whatIsCorrect = false;
    this.popupWarning = false;
  }

  nextQuestion() {
    let nextQuestion = false;
    if (this.isQuestionAnswered(this.question)) {

    }
    if (nextQuestion) {
      if (this.currentQuestion < this.questions.length - 1) {
        this.currentQuestion++;
        this.question = this.questions[this.currentQuestion];
      }
    }
    this.whatIsCorrect = false;
  }


  isQuestionAnswered(question: Question): boolean {
    // is givenanswer = true
    if (
      this.question.qanswers.findIndex((ans) => ans.givenanswer === true) != -1
    ) {
      return true;
    } else {
      return false;
    }
  }

  firstQuestion() {
    this.currentQuestion = 0;
    this.question = this.questions[this.currentQuestion];
    this.whatIsCorrect = false;
  }

  lastQuestion() {
    this.currentQuestion = this.questions.length - 1;
    this.question = this.questions[this.currentQuestion];
    this.whatIsCorrect = false;
  }

  keyInput(input: string) {
    if (input.length == 0) {
      this.question.qgivenanswerFillIn = '';
      this.question.qanswers[0].givenanswer = false;
    } else {
      this.question.qgivenanswerFillIn = input;
      this.question.qanswers[0].givenanswer = true;
    }
  }

  isQuestionAnswerOk(question: Question): boolean {
    if (this.question.qtyp === 'mc' || this.question.qtyp === 'sc') {
      if (
        this.question.qanswers.find((ans) => ans.correct != ans.givenanswer)
      ) {
        this.incorrectlyAnsweredCount++;
        return false;
      } else {
        return true;
      }
    } else if (this.question.qtyp === 'fi') {
      if (this.question.qgivenanswerFillIn !== '') {

        if (
          this.question.qanswers.findIndex(
            (a) => a.txt[0] == this.question.qgivenanswerFillIn
          ) != -1
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  skipQuestion() {
    if (this.currentQuestion < this.questions.length - 1) {
      this.currentQuestion++;
      this.question = this.questions[this.currentQuestion];
    }
    this.whatIsCorrect = false;
  }

  resetCurrentAnsweredQuestion() {
    this.question.qanswers.map((ans) => (ans.givenanswer = false));
  }

  resetPreviousAnsweredQuestion() {
    if (this.currentQuestion >= 1)
      this.questions[this.currentQuestion - 1].qanswers.map(
        (ans) => (ans.givenanswer = false)
      );
  }

  handleInputChange(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.keyInput(inputValue);
  }

  finish() {
    let answeredCorrectly = 0;
    let answeredIncorrectly = 0;

    for (const question of this.questions) {
      if (this.isQuestionAnswered(question)) {
        if (this.isQuestionAnswerOk(question)) {
          answeredCorrectly++;
        } else {
          answeredIncorrectly++;
        }
      }
    }
    if (answeredIncorrectly >= 7) {
      this.showAbortedMessage();
    } else {
      this.showResults(answeredCorrectly, answeredIncorrectly);
    }
  }

  showAbortedMessage() {
    const message = `Check mode aborted due to too many incorrect answers. Please use the Learn mode.`;
    alert(message);
  }


  showResults(answeredCorrectly: number, answeredIncorrectly: number) {
    const message = `Questions answered correctly: ${answeredCorrectly}\nQuestions answered incorrectly: ${answeredIncorrectly}`;
    alert(message);
  }
  failExamCheck(){
    if (this.incorrectQuestionsCheck > 7){

      this.examFailMessageCheck = true;
    }
  }
}
