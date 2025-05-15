import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NouveauterComponent } from './nouveauter/nouveauter.component';
import { TestMonCvComponent } from './test-mon-cv/test-mon-cv.component';
import { AboutNousComponent } from './about-nous/about-nous.component';
import { CreationCVComponent } from './creation-cv/creation-cv.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ChatBotComponent } from './chat-bot/chat-bot.component';
import { LogInComponent } from './log-in/log-in.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

const routes: Routes = [
  { path : '', redirectTo: '/home', pathMatch: 'full' }, // Redirect default path to /home
  { path : 'home', component: HomeComponent }, // Home route
  { path : 'nouveauter', component: NouveauterComponent }, // Route for nouveauté
  { path : 'test-mon-cv', component: TestMonCvComponent}, // Route for test-mon-cv
  { path : 'creation-cv', component: CreationCVComponent}, // Route for creation-cv
  { path : 'about-nous', component: AboutNousComponent}, // Route for about-nous
  { path : 'chat-bot', component: ChatBotComponent}, // Route for chat-bot
  { path : 'log-in', component: LogInComponent}, // Route for log-in
  { path : 'signup', component: SignupComponent}, // Route for signup (using the same component as log-in)
  { path : 'not-found', component: NotFoundComponent }, // Route for not-found
  { path : 'forgot-password', component: ForgotPasswordComponent}, // Route for forgot-password
 { path : '**', component: NotFoundComponent } // Redirect any unknown paths to /home
  
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
