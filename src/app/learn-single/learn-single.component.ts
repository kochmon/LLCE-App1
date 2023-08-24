import { Component } from '@angular/core';
import { QueriesService } from '../queries.service';
import { Question } from '../question';

@Component({
  selector: 'llce-learn-single',
  templateUrl: './learn-single.component.html',
  styleUrls: ['./learn-single.component.css']
})
export class LearnSingleComponent {
  questions: Question[];
  question: Question;
  whatIsCorrect: boolean = false
  currentQuestion: number = -1
  selectedAnswerIndex: any;


  constructor(private qs: QueriesService) {
    this.questions = this.qs.getAll();
    this.currentQuestion = 0
    this.question = this.questions[this.currentQuestion]
  }

  isQuestionAnswered(): boolean {
    // ist ein givenanswer = true
    if (
      this.question.qanswers.findIndex((ans) => ans.givenanswer === true) != -1
    ) {
      return true;
    } else {
      return false;
    }
  }

  toggleCorrect(ind: number) {
    if (this.currentQuestion == ind) {
      this.whatIsCorrect = !this.whatIsCorrect
    } else {
      this.currentQuestion = ind
      this.whatIsCorrect = true
    }
  }

  prevQuestion() {
    if(this.currentQuestion > 0) {
      this.currentQuestion--
      this.question = this.questions[this.currentQuestion]
    }
    this.whatIsCorrect = false
  }

  nextQuestion() {
    if(this.currentQuestion < this.questions.length -1) {
      this.currentQuestion++
      this.question = this.questions[this.currentQuestion]
    }
    this.whatIsCorrect = false
  }

  firstQuestion() {
      this.currentQuestion = 0
      this.question = this.questions[this.currentQuestion]
      this.whatIsCorrect = false
    }

  lastQuestion() {
      this.currentQuestion = this.questions.length -1
      this.question = this.questions[this.currentQuestion]
      this.whatIsCorrect = false
    }

  selectAnswer(ind: number) {
    this.question.qanswers[ind].givenanswer =
      !this.question.qanswers[ind].givenanswer;
  }

  isQuestionAnswerOk() {
      // finde eine falsche Antwort -> gesamte Frage ist falsch
    if(this.question.qanswers.find(ans => ans.correct != ans.givenanswer)) {
      return false
    } else {
      return true;
    }
  }

  resetCurrentAnsweredQuestion() {
     this.question.qanswers.map(ans => ans.givenanswer = false)
  }

  resetPreviousAnsweredQuestion() {
     if(this.currentQuestion >= 1)
     this.questions[this.currentQuestion-1].qanswers.map(ans => ans.givenanswer = false)
  }
}
