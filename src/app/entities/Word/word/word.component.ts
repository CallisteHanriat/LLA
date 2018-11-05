import { Component, OnInit } from '@angular/core';
import { WordService } from '../word.service';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.css']
})
export class WordComponent implements OnInit {
  words: any;
  displayedColumns = ['word', 'translation'];
  dataSource = new BookDataSource(this.wordService);
  constructor(private wordService: WordService) { }

  ngOnInit() {
    this.wordService.getWords().subscribe(res => {
      console.log('WordComponent: getting data : ' + res);
      this.words = res;
    }, err => {
      console.log(err);
    });
  }

}
export class BookDataSource extends DataSource<any> {
  constructor(private api: WordService) {
    super();
  }

  connect() {
    return this.api.getWords();
  }

  disconnect() {

  }
}