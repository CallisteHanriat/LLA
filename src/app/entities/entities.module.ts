import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule,
  MatIconModule,
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule } from '@angular/material';

import { appRoutes } from './Word/word.route';
import { Router, RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { WordComponent } from './Word/word/word.component';
import { WordCreateComponent } from './Word/word-create/word-create.component';
import { HomeComponent } from '../share/component/home/home.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes, {onSameUrlNavigation: 'reload'}),
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    ReactiveFormsModule    
  ],
  declarations: [
    WordComponent,
    WordCreateComponent,
    HomeComponent
  ]
})
export class EntitiesModule { }
