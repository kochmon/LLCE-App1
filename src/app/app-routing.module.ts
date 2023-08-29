import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckComponent } from './check/check.component';
import { CheckFiComponent } from './check-fi/check-fi.component';
import { CheckMcComponent } from './check-mc/check-mc.component';
import { CheckScComponent } from './check-sc/check-sc.component';
import { LearnComponent } from './learn/learn.component';
import { LearnListComponent } from './learn-list/learn-list.component';
import { LearnSingleComponent } from './learn-single/learn-single.component';
import { MainComponent } from './main/main.component';
import { ExamComponent } from './exam/exam.component';

const routes: Routes = [
  {path: '', redirectTo: 'main', pathMatch: 'full'},
  {path: 'main', component: MainComponent },
  {path: 'exam', component: ExamComponent},
  {path: 'learn', component: LearnComponent },
  {path: 'learn-list', component: LearnListComponent },
  {path: 'learn-single', component: LearnSingleComponent },
  {path: 'check', component: CheckComponent },
  {path: 'check-fi', component : CheckFiComponent },
  {path: 'check-sc', component: CheckScComponent },
  {path: 'check-mc', component: CheckMcComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
