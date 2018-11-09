import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule  } from '@angular/forms';
import {
  MatCardModule,
  MatFormFieldModule, 
  MatIconModule} from '@angular/material';

 import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './share/component/home/home.component';
import { EntitiesModule } from './entities/entities.module';
import { FileSelectDirective } from 'ng2-file-upload';
import { ShareModule } from './share/share.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    HttpClientModule,
    EntitiesModule,
    MatCardModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    ShareModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
