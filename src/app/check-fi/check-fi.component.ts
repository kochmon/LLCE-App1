import { Answer } from './../question';
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

  constructor(private qs: QueriesService) {
    this.questions = this.qs.getAll().filter((q) => q.qtyp == 'fi');
    // antworten initialisieren
    this.questions.map((q) => {
      q.qtyp == 'mc';
      q.qanswers.map((a) => (a.givenanswer = false));
    });
    this.questions.map((q) => {
      q.qtyp == 'sc';
      q.qanswers.map((a) => (a.givenanswer = false));
    });
    this.questions.map((q) => {
      q.qtyp == 'fi';
      q.qgivenanswerFillIn = '';
    });
    this.questions.map((q) => {
      q.qtyp == 'fi';
      q.qanswers[0].givenanswer = false;
    });

    this.currentQuestion = 0;
    this.question = this.questions[this.currentQuestion];
  }

  toggleCorrect(ind: number) {
    if (this.currentQuestion === ind) {
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
    // check mode: if q is not answered -> next question
    //             if q is answered -> check if ok else 1 q back
    let nextQuestion = false;
    if (this.isQuestionAnswered(this.question)) {
      // console.log('q answered');

    }
    if (nextQuestion) {
      if (this.currentQuestion < this.questions.length - 1) {
        this.currentQuestion++;
        this.question = this.questions[this.currentQuestion];
      }
    }
    this.whatIsCorrect = false;
  }

  /* isQuestionAnswered(): boolean {
    if(this.question.qtyp === 'fi') {
      return this.question.qgivenanswerFillIn?.trim() !== '';
    } else {
      return this.question.qanswers.some(ans => ans.givenanswer);
    }
  } */

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
      // input is empty -> no answer given
      this.question.qgivenanswerFillIn = '';
      this.question.qanswers[0].givenanswer = false;
    } else {
      // store answer ans set givenanswer = true
      this.question.qgivenanswerFillIn = input;
      this.question.qanswers[0].givenanswer = true;
    }
    // console.log(input);
  }

  isQuestionAnswerOk(question: Question): boolean {
    // check ms/sc
    if (this.question.qtyp === 'mc' || this.question.qtyp === 'sc') {
      // finde eine falsche Antwort -> gesamte Frage ist falsch
      if (
        this.question.qanswers.find((ans) => ans.correct != ans.givenanswer)
      ) {
        this.incorrectlyAnsweredCount++;
        return false;
      } else {
        return true;
      }
    } else if (this.question.qtyp === 'fi') {
      // check fi
      if (this.question.qgivenanswerFillIn !== '') {
        // Antwort gegeben : check korrekt Anstwort

        if (
          this.question.qanswers.findIndex(
            (a) => a.txt[0] == this.question.qgivenanswerFillIn
          ) != -1
        ) {
          // correct answer found
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      // not either mc/sc/fi
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
}
