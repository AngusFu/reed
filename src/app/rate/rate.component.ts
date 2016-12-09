import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'rate',
  templateUrl: './rate.component.html',
  styleUrls: [
    './rate.component.scss',
    './rate.component.scss'
  ]
})
export class RateComponent implements OnInit {
  // 默认的分值
  rateVal: number = 0;
  // 用于 mouseover 记住 rateVal
  rateMemo: number = 0;
  // label 文本
  rateText: string[] | number[] = ['极差', '失望', '一般', '满意', '惊喜'];
  // 是否显示 label
  showLabel = false;
  isReadonly = false;

  /**
   * 评分  rate
   */
  @Output() rateChange = new EventEmitter();

  @Input() get rate() {
    let val = this.rateVal;
    val = val < 0 ? 0 : (val > 5 ? 5 : val);
    return val;
  }

  set rate(val: number) {
    this.rateVal = val;
    this.rateChange.emit(this.rateVal);
  }

  /**
   * 自定义文本 text
   */
  @Input() get text() {
    return this.rateText;
  };

  set text(text) {
    this.showLabel = text !== void 0 && text !== null;
    this.rateText = !this.showLabel ? null : (text || this.rateText);
  }

  /**
   * readonly
   */
  @Input() get readonly() {
    return this.isReadonly;
  }

  set readonly(readonly) {
    this.isReadonly = readonly !== void 0 && String(readonly) !== 'false';
  }

  click(rate: number, e: MouseEvent) {
    e.preventDefault();
    this.rate = rate;
    this.rateMemo = this.rate;
  }

  mouseenter(i: number) {
    this.rateMemo = this.rate;
    this.rateVal = i;
  }

  mouseleave(i: number) {
    this.rate = this.rateMemo;
  }

  constructor() {}

  ngOnInit() {}
}

