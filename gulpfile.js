const gulp = require('gulp');
const babel = require('gulp-babel');
// const uglify = require('gulp-uglify-es').default;

gulp.task('build', () => gulp.src('./src/*.js')
  .pipe(babel())
  // .pipe(uglify({ // FIXME: 冒頭コメントが２重になる不具合
  //   output: {
  //     comments: true,
  //   },
  // }))
  .pipe(gulp.dest('./dist')));
