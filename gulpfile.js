const gulp = require('gulp');
const babel = require('gulp-babel');
const minify = require('gulp-babel-minify');
const header = require('gulp-header');

const LICENCE = require('./template/licence.js');

gulp.task('build', () => gulp.src('./src/*.js')
  .pipe(babel())
  .pipe(minify(
    {
      evaluate: true, // 計算値を統合
      mangle: false, // 変数名を暗号化
      memberExpressions: true, // 予約語を安全変換
      propertyLiterals: false, // {"0":}を{0:}にする
      removeConsole: false,
      removeDebugger: true,
      removeUndefined: false, // 不要なundefinedを省略
      simplifyComparisons: true, // === を == に
      undefinedToVoid: true, // undefined を void 0 に
      deadcode: true, // 到達不能コードを削除
    },
    {
      comments: /^:/,
    },
  ))
  .pipe(header(LICENCE))
  .pipe(gulp.dest('./dist')));
