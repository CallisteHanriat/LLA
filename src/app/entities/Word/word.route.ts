import { Routes } from "@angular/router";
import { WordComponent } from "./word/word.component";
import { WordCreateComponent } from "./word-create/word-create.component";


export const appRoutes: Routes = [
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

