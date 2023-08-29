import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CheckComponent } from './check/check.component';
import { CheckFiComponent } from './check-fi/check-fi.component';
import { CheckMcComponent } from './check-mc/check-mc.component';
import { CheckScComponent } from './check-sc/check-sc.component';
import { LearnComponent } from './learn/learn.component';
import { LearnListComponent } from './learn-list/learn-list.component';
import { LearnSingleComponent } from './learn-single/learn-single.component';
import { ExamComponent } from './exam/exam.component';
import { MainComponent } from './main/main.component';

@NgModule({
  declarations: [
    AppComponent,
    CheckComponent,
    CheckFiComponent,
    CheckMcComponent,
    CheckScComponent,
    LearnComponent,
    LearnListComponent,
    LearnSingleComponent,
    ExamComponent,
    MainComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
