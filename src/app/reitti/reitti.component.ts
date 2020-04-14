import { ReititService } from './../reitit.service';
import { Component, OnInit } from '@angular/core';
import { FormsModule }   from '@angular/forms';

@Component({
  selector: 'app-reitti',
  templateUrl: './reitti.component.html',
  styleUrls: ['./reitti.component.css']
})
export class ReittiComponent implements OnInit {

  constructor(public reitit : ReititService, private fm: FormsModule) {  }
  ngOnInit() {  }

}
