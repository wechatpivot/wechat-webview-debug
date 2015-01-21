var gulp = require('gulp');
var rename = require('gulp-rename');


gulp.task('build', function () {
  return gulp
    .src('src/index.js')
    .pipe(rename('weixin-js-sdk-1.0.0-mockup.js'))
    .pipe(gulp.dest('build'));
});

gulp.task('default', [ 'build' ]);
