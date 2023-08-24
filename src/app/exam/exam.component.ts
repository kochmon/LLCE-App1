import { Component, OnInit } from '@angular/core';
import { Question } from '../question';
import { QueriesService } from '../queries.service';
import { Router } from '@angular/router';

@Component({
  selector: 'llce-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css']
})
export class ExamComponent implements OnInit{

  questions: Question[];
  question: Question;
  whatIsCorrect: boolean = false;
  currentQuestion: number = -1;
  popupWarning: boolean = false;
  totalQuestions: number;
  guessedQuestions: number = 0;
  incorrectQuestions: number = 0;

  constructor(private qs: QueriesService, private router: Router) {
    // get Single Choice Questions
    this.questions = this.qs.getAll().filter((q) => q.qtyp == 'sc');
    // antworten initialisieren
    this.questions.map(q => {q.qtyp == 'mc'; q.qanswers.map(a => a.givenanswer = false)})
    this.questions.map(q => {q.qtyp == 'sc'; q.qanswers.map(a => a.givenanswer = false)})
    this.questions.map(q => {q.qtyp == 'fi'; q.qgivenanswerFillIn = ''})

    this.currentQuestion = 0;
    this.question = this.questions[this.currentQuestion];
    this.totalQuestions = this.questions.length;

    this.questions = this.qs.getAll().filter((q) => q.qtyp == 'sc');
    this.shuffleQuestions();
  }

  // goToLearnMode() {
  //   this.router.navigate(['/learn']); // Redirect to the Learn mode
  // }

  ngOnInit() {
    const shuffledQuestions = this.shuffleArray(this.questions);
    this.questions = shuffledQuestions;
  }

  shuffleArray(array: any[]): any[] {
    const shuffledArray = [...array];
    for(let i = shuffledArray.length - 1; i > 0; i++){
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  }

  shuffleQuestions() {
    // Mische die Fragen in zufälliger Reihenfolge
    const shuffledQuestions = this.shuffleArray(this.questions);
    this.questions = shuffledQuestions;
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
    let nextQuestion = false;
    if (this.isQuestionAnswered(this.question)) {
      console.log('q answered')
      // frage prüfen ob ok: if ok -> next question else 1 q back
      if (this.isQuestionAnswerOk(this.question)) {
      console.log('answer(s) ok')
      nextQuestion = true;
      } else {
        // answer not ok -> warning and 1 question back
        console.log('popup warning')
        this.resetCurrentAnsweredQuestion()
        this.resetPreviousAnsweredQuestion()
        this.prevQuestion();
        this.popupWarning = true;
      }
    } else {
      nextQuestion = true;
    }
    if (nextQuestion) {
      if (this.currentQuestion < this.questions.length - 1) {
        this.currentQuestion++;
        this.question = this.questions[this.currentQuestion];
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
    // console.log(input);
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
    // this.showResults(answeredCorrectly, answeredIncorrectly);

    const incorrectPercentage = (this.incorrectQuestions / this.totalQuestions) * 100;
    if(incorrectPercentage >=20) {
      this.showResults(answeredCorrectly, answeredIncorrectly, true);
    } else {
      this.showResults(answeredCorrectly, answeredIncorrectly, false);
    }
  }

  // finish() {
  //   let answeredCorrectly = 0;
  //   let answeredIncorrectly = 0;
  //   // Überprüfe den Prozentsatz der falsch beantworteten Fragen
  //   const incorrectPercentage = (this.incorrectQuestions / this.totalQuestions) * 100;

  //   if (incorrectPercentage >= 20) {
  //     // Prüfung nicht bestanden
  //     this.failExam();
  //   } else {
  //     // Prüfung bestanden
  //     this.showResults(answeredCorrectly, answeredIncorrectly, false);
  //   }
  // }

  showResults(answeredCorrectly: number, answeredIncorrectly: number, isAborted: boolean) {
    const message = `Questions answered correctly: ${answeredCorrectly}\nQuestions answered incorrectly: ${answeredIncorrectly}`;
    alert(message);
    if(isAborted) {
      alert(`${message}\n\nPrüfmodus abgebrochen aufgrund von mehr als 20% falsch beantworteten Fragen.`);
    } else {
      alert(message);
    }
  }

  failExam() {
    alert("You did not pass the exam. Please review the Learn mode.");
    this.router.navigate(['/learn']); // Umleitung zur Learn-Seite
  }
}
