var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('test', function() {
  var error = false;
  gulp.
    src('./test/unitTesting.js').
    pipe(mocha()).
    on('error', function() {
      console.log('Tests failed!');
      error = true;
    }).
    on('end', function() {
      if (!error) {
        console.log('Tests succeeded! Enter the below code:\n' +
          require('fs').readFileSync('./output.dat'));
        process.exit(0);
      }
    });
});

gulp.task('watch', ['test'], function() {
  gulp.watch(['./test/**.js'], ['test']);
});
