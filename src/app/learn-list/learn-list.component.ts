import { Component } from '@angular/core';

import { Question } from '../question';
import { QueriesService } from '../queries.service';

@Component({
  selector: 'llce-learn-list',
  templateUrl: './learn-list.component.html',
  styleUrls: ['./learn-list.component.css'],
})
export class LearnListComponent {
  questions: Question[];
  whatIsCorrect: boolean = false
  currentQuestion: number = -1


  constructor(private qs: QueriesService) {
    this.questions = this.qs.getAll();
  }

  toggleCorrect(ind: number) {
    if (this.currentQuestion == ind) {
      this.whatIsCorrect = !this.whatIsCorrect
    } else {
      this.currentQuestion = ind
      this.whatIsCorrect = true
    }


  }
}
