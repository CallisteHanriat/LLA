import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { WordComponent } from './entities/Word/word/word.component';
import { WordCreateComponent } from './entities/Word/word-create/word-create.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
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

  import { HttpClientModule } from '@angular/common/http';
const appRoutes: Routes = [
  {
    path: 'words',
    component: WordComponent,
    data: {title: 'Word list'}
  },
  {
    path: 'word-create',
    component: WordCreateComponent,
    data: {title: 'Create word'}
  },
  {
    path: '',
    redirectTo: '/words',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    WordComponent,
    WordCreateComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    HttpClientModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
