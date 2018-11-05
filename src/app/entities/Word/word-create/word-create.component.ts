import { Component, OnInit } from '@angular/core';
import { WordService } from '../word.service';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-word-create',
  templateUrl: './word-create.component.html',
  styleUrls: ['./word-create.component.css']
})
export class WordCreateComponent implements OnInit {
  wordForm: FormGroup;
  word: String = '';
  translation: String = '';

  constructor(private wordService: WordService,
    private router: Router,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.wordForm = this.formBuilder.group({
      'word': [null, Validators.required],
      'translation': [null, Validators.required]
    });
  }

  onFormSubmit(form: NgForm) {
    this.wordService.postWord(form).subscribe(res => {
      // let id = res['_id'];
      this.router.navigateByUrl('/');
    }, (err) => {
      console.log(err);
    });
  }

}
