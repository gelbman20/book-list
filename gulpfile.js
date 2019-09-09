const
  gulp =          require('gulp'),
  pug =           require('gulp-pug'),
  sass =          require('gulp-sass'),
  autoprefixer  = require('gulp-autoprefixer'),
  browsersync =   require('browser-sync').create(),
  clean =         require('gulp-clean');

// Clean folder
function cleanFolder() {
  return gulp.src('docs/*', {read: false})
    .pipe(clean());
}

// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "./dev"
    },
    port: 8000,
  });
  done();
}

function reload(done) {
  browsersync.reload();
  done();
}

// Compile pug files into HTML
function compilePug() {
  return gulp.src('dev/pug/pages/!(_)*.pug')
    .pipe(pug({
      pretty: true,
      verbose: true,
      self: true,
      emitty: true
    }))
    .pipe(gulp.dest('dev/'))
    .pipe(browsersync.stream());
}

// Compile sass files into CSS
function compileSass() {
  return gulp.src([
    `dev/scss/bootstrap/bootstrap.scss`,
    `dev/scss/custom/style.scss`,
    `dev/scss/fonts/fonts.scss`
  ])
    .pipe(sass({
      outputStyle: 'expanded',
      indentType: 'tab',
      indentWidth: 1,
      linefeed: 'cr',
      onError: browsersync.notify
    }))
    .pipe(gulp.dest('dev/css'))
    .pipe(autoprefixer(['Chrome >= 45', 'Firefox ESR', 'Edge >= 12', 'Explorer >= 10', 'iOS >= 9', 'Safari >= 9', 'Android >= 4.4', 'Opera >= 30']))
    .pipe(browsersync.stream());
}

// Serve and watch sass/pug files for changes
function watchFiles(done) {
  gulp.watch('dev/scss/**/*.scss', gulp.series(compileSass));
  gulp.watch('dev/css/**/*.css', browsersync.reload);
  gulp.watch('dev/pug/**/*.pug', gulp.series(compilePug));
  gulp.watch('dev/js/script.js', browsersync.reload);
  gulp.watch('dev/*.html', browsersync.reload);
  done();
}

// Copy project folder and files to docs folder
let copy = () => {
  return gulp 
    .src([
      'dev/**/css/**/bootstrap.css',
      'dev/**/css/**/style.css',
      'dev/**/css/**/fonts.css',
      'dev/**/fonts/**/*.{otf,eot,svg,ttf,woff,woff2}',
      'dev/**/images/**/*',
      'dev/**/js/**/script.js',
      'dev/**/js/**/vue.js',
      'dev/**/**/*.html'
    ])
    .pipe(gulp.dest('docs/'))
};

const build = gulp.series(cleanFolder, compileSass, compilePug, copy);
const watch = gulp.series(compilePug, watchFiles, browserSync);
const server = gulp.series(watchFiles, browserSync);

exports.clean = cleanFolder;
exports.copy = copy;
exports.server = server;
exports.sass = compileSass;
exports.pug = compilePug;
exports.build = build;
exports.default = watch;