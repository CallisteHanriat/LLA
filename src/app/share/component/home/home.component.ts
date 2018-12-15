import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { FileService } from '../services/file.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private url = 'http://localhost:3000/api/upload';
  private uploader: FileUploader;
  private fileName: string;

  constructor(private fileService: FileService) { }

  ngOnInit() {
    this.uploader = new FileUploader({url: this.url});
  }
  
  uploadfile() {
    console.log('file upload');
    this.uploader.uploadAll();
  }
}
