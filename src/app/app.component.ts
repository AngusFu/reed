import { Component } from '@angular/core';

import { Observable } from 'rxjs/Observable'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  state = {
    rate: 3,
    rateText: ['完全不同意', '不太同意', '说不清楚', '比较符合', '完全符合']
  };
  constructor() {
    console.log(Observable);
  }
}
