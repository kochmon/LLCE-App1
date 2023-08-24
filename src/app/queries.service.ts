import { Injectable } from '@angular/core';

import lpic101 from '../assets/questions.json'
import { Question } from './question';

@Injectable({
  providedIn: 'root'
})
export class QueriesService {
  // questions: Question[] = lpic101
  questions: Question[] = []

  constructor() {
    this.questions = lpic101
  }

  getAll(): Question[] {
    return this.questions
  }

  getAllMc(): Question[] {
    return this.questions.filter(q => q.qtyp == 'mc')
  }

  getAllSc(): Question[] {
    return this.questions.filter(q => q.qtyp == 'sc')
  }

  getAllFi(): Question[] {
    return this.questions.filter(q => q.qtyp == 'fi')
  }
}
