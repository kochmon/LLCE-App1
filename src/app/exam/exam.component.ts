import { QueriesService } from './../queries.service';
import { Question } from './../question';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'llce-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css']
})
export class ExamComponent {

  questions: Question[];
  question: Question;
  whatIsCorrect: boolean = false;
  currentQuestion: number = -1;
  popupWarning: boolean = false;
  totalQuestions: number;
  guessedQuestions: number = 0;
  incorrectQuestions: number = 0;
  showLearnButton: boolean = false;
  examFailMessage: boolean = false;
  currentQuestionType: string;

  constructor(private qs: QueriesService, private router: Router) {
    // get All Questions
    this.questions = this.qs.getAll();

    // antworten initialisieren
    this.questions.map(q => {q.qtyp == 'mc'; q.qanswers.map(a => a.givenanswer = false)})
    this.questions.map(q => {q.qtyp == 'sc'; q.qanswers.map(a => a.givenanswer = false)})
    this.questions.map(q => {q.qtyp == 'fi'; q.qgivenanswerFillIn = ''})

    this.currentQuestion = 0;
    this.question = this.questions[this.currentQuestion];
    this.totalQuestions = this.questions.length;

    this.currentQuestionType = this.questions[this.currentQuestion].qtyp;
  }

  goToLearnMode() {
    this.router.navigate(['/learn']); // Redirect to the Learn mode
  }

  shuffleQuestions() {
    this.questions = this.questions.sort((a,b) => 0.5 - Math.random());
    this.checkQuestionStatus();
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
    // check mode: if q is not answered -> next question
    //             if q is answered -> check if ok else 1 q back
    let nextQuestion = true;
    if (this.isQuestionAnswered(this.question)) {
      console.log('q answered')
      // frage prüfen ob ok: if ok -> next question else 1 q back
      if (!this.isQuestionAnswerOk(this.question)) {
      console.log('answer(s) ok')
      this.incorrectQuestions++;
      this.failExam();
      } else if (this.isQuestionAnswerGuessed(this.question)) {
        // answer not ok -> warning and 1 question back
        console.log('popup warning')
        this.guessedQuestions++;
      }
    }
    if (nextQuestion) {
      if (this.currentQuestion < this.questions.length - 1) {
        this.currentQuestion++;
        this.question = this.questions[this.currentQuestion];
        this.currentQuestionType = this.question.qtyp;
      }
    }
    this.popupWarning = false;
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
  }

  isQuestionAnswered(question: Question): boolean  {
    // ist ein givenanswer = true
    if (
      this.question.qanswers.findIndex((ans) => ans.givenanswer === true) != -1
    ) {
      return true;
    } else {
      return false;
    }
  }

  selectAnswerSC(ind: number) {
    // reset all givenanswer to false (this is single choice)
    this.question.qanswers.map(a => a.givenanswer = false)
    // then set choosen answer to true
    this.question.qanswers[ind].givenanswer = true
    this.checkQuestionStatus();
  }

  isQuestionAnswerOk(question: Question): boolean {
    // finde eine falsche Antwort -> gesamte Frage ist falsch
    if(this.question.qanswers.find(ans => ans.correct !== ans.givenanswer)) {
      return false
    } else {
      return true;
    }
  }

  skipQuestion() {
    if (this.currentQuestion < this.questions.length - 1) {
      this.currentQuestion++;
      this.question = this.questions[this.currentQuestion];
    }
    this.whatIsCorrect = false;
    this.checkQuestionStatus();
  }

  resetCurrentAnsweredQuestion() {
    this.question.qanswers.map(ans => ans.givenanswer = false)
  }

  resetPreviousAnsweredQuestion() {
    if(this.currentQuestion >= 1)
    this.questions[this.currentQuestion-1].qanswers.map(ans => ans.givenanswer = false)

  }

  checkQuestionStatus() {
    if (this.isQuestionAnswered(this.question)) {
      if (!this.isQuestionAnswerOk(this.question)) {
        this.incorrectQuestions++;
      } else if (this.isQuestionAnswerGuessed(this.question)) {
        this.guessedQuestions++;
      }
    }
  }

  isQuestionAnswerGuessed(question: Question): boolean {
    const unanswered = question.qanswers.every(ans => !ans.givenanswer);
    return unanswered;
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

    const incorrectPercentage = (this.incorrectQuestions / this.totalQuestions) * 100;
    if(incorrectPercentage > 20) {
      // Prüfung nicht bestanden
      this.failExam();
    } else {
      // Prüfung bestanden
      this.showResults(answeredCorrectly, answeredIncorrectly);
    }
  }

  showResults(answeredCorrectly: number, answeredIncorrectly: number) {
    const message = `Questions answered correctly: ${answeredCorrectly}\nQuestions answered incorrectly: ${answeredIncorrectly}`;
    alert(message);

  }

  failExam(){
    if (this.incorrectQuestions > this.totalQuestions*0.2 ){

      this.examFailMessage=true
    }
  }

}
