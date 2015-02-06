var gulp = require('gulp');


gulp.task('sync:beautify', function () {
  return gulp
    .src('../weixin-js-sdk-beautify/jweixin-1.0.0.beautify.js')
    .pipe(gulp.dest('./'));
})


gulp.task('build', function () {
  return gulp
    .src('src/*.js')
    .pipe(gulp.dest('dist'));
});


gulp.task('default', [ 'build' ]);
