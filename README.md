# reed

"Man is but a reed, the most feeble thing in nature, but he is a thinking reed".

**This project is far from perfect. Please do not use it in your production.**

## TODO

### About building vendor files

<del>
Reed got severe problem with rxjs when bundling all `@angular` modules as "vendor". A solution is on the way to my mind. More investigation & experiments are needed. Hope it would get solved soon.
</del>(
SEE: https://medium.com/@Wemlin/excellent-af7fd9354389#.3wts6xew5)

Currentl problem is when we import `rxjs/Rx` in `./src/vendor.ts`, linter will not recognise those modules that should be imported specifically in our `*.ts`, which could ruin our AOT result. For now, after vendor building, remove lines about `rxjs` in `./src/vendor.ts` could solve the problem.

### About Rollup

Rollup has some problem with watch mode, since it uses `rollup-watch`, which could lead to infinite bundling and reloading, causing a stack-overflow error.

Another problem is how to work with angular. Thanks to `rollup-plugin-angular`, some are solved.But how to watch those template/style files (namely `.css``.scss``.html` etc.)? 

After some deep research, on the basis of `rollup-watch`, I came up with `rollup-watch-angular`. However, as mentioned above, this could lead to a stack-overflow too. In my practice, after many frequent reloading, computer performance got lower and lower. Why is that? It still needs some research. For now, the only thing I can do is to terminate my command line program and restart it now and then.

## Ideas

Use [System.js](http://plnkr.co/edit/HDnJrb3TvSAYgoyRFl2S) just for DEV?

Or check [angular2-webpack-starter](https://github.com/AngularClass/angular2-webpack-starter)?

Take a look at [angular2-rollup-starter](https://github.com/AngusFu/angular2-rollup-starter). To be honest, it'a a lot better than this.
