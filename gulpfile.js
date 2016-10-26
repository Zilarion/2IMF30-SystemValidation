var gulp  = require('gulp')
var run = require('gulp-run');
var watch = require('gulp-watch')
var runSequence = require('run-sequence')

// Required paths
var paths = {
  fn: 'solar',
  mcf: {
    files: 'mcf/*.mcf',
    folder: 'mcf'
  },
  pbes: {
    files: 'pbes/*.pbes',
    folder: 'pbes'
  }
}

// Create lps from lts
gulp.task('lps', function () {
  return run('mcrl22lps ' + paths.fn + '.mcrl2  ' + paths.fn + '.lps').exec();
})

// Create lts from lps
gulp.task('lts', function () {
  return run('lps2lts ' + paths.fn + '.lps  ' + paths.fn + '.org.lts').exec();
})

// Reduce lts
gulp.task('convert', function () {
  return run('ltsconvert --equivalence=dpbranching-bisim ' + paths.fn + '.org.lts  ' + paths.fn + '.lts').exec();
})

// Create pbes from all lps and modal u
gulp.task('pbes', function() {
  return gulp
    .src(paths.mcf.files)
    .pipe(run('lts2pbes ' + paths.fn + '.lts  -f mcf/<%= file.relative %>  pbes/<%= file.relative %>.pbes'));
})

// Validate all pbes
gulp.task('validate', function() {
  return gulp
    .src(paths.pbes.files)
    .pipe(run('pbes2bool pbes/<%= file.relative %>'))
    .pipe(gulp.dest('results'))
})

// Build new lps lts and pbes
gulp.task('build', function(cb) {
  runSequence('lps', 'lts', 'convert' , 'pbes', cb);
}); 

// Automatically generate lps, lts and pbes when the mcrl2 specification is updated
gulp.task('watch', function() {
  return gulp.watch(paths.fn + '.mcrl2', ['build']);
})
