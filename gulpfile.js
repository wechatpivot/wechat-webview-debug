var fs = require('fs');
var gulp = require('gulp');
var runSequence = require('run-sequence');
var uglify =require('gulp-uglify');
var rename =require('gulp-rename');
var replace = require('gulp-replace');


gulp.task('bridge', function () {
  return gulp
    .src('src/weixin-js-bridge-mockup.js')
    .pipe(uglify())
    .pipe(rename('weixin-js-bridge-mockup.min.js'))
    .pipe(gulp.dest('src/'));
});


gulp.task('hook', function () {
  fs.readFile('src/weixin-js-bridge-mockup.min.js', 'utf8', function (err, bridge) {
    bridge = bridge.slice(0, -1);
    gulp
      .src('src/hook.js')
      .pipe(replace('{{ WeixinJSBridge }}', bridge))
      .pipe(gulp.dest('build/'));
  });
});


gulp.task('default', function () {
  runSequence('bridge', 'hook');
});
