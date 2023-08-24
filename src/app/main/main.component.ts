import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'llce-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  constructor(private router: Router) {}

  navigateToPage(CheckComponent: string) {
    this.router.navigate([CheckComponent]);
  }

  navigateToLearn(LearnComponent: string) {
    this.router.navigate([LearnComponent]);
  }

  navigateToExam(ExamComponent: string) {
    this.router.navigate([ExamComponent]);
  }
}
