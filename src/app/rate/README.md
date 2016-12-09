
# 评分组件 RateComponent

## 使用

```html
<rate [(rate)]="state.rate" [text]="state.rateText" readonly="false"></rate>
```

## 说明

- `[(rate)]`
  - Required
  - @desc: 双向数据绑定
  - @type: `1 | 2 | 3| 4 | 5` 之一

- `[text]`
  - Optional
  - @desc: 1-5 分对应的标签
  - @type: `Array | undefined`
  - @note: 数组长度不小于 5；如果不传值，则应用默认值

- `[readonly]`
  - Optional
  - @desc: 是否只读
  - @note: 只要设置值不为 false | 'false'，默认为 true
