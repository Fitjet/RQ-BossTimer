import gulp from 'gulp';
import htmlmin from 'gulp-htmlmin';
import browser from 'browser-sync';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import rename from 'gulp-rename';
import csso from 'postcss-csso';
import del from 'del';


// HTML

const html = () => {
  return gulp.src('src/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('build'));
}

// Styles

export const styles = () => {
  return gulp.src('src/css/style.css')
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css'))
    .pipe(browser.stream());
}

// Scripts

const scripts = () => {
  return gulp.src('src/js/*.js')
    .pipe(gulp.dest('build/js'))
    .pipe(browser.stream());
}

// Images

const copyImages = () => {
  return gulp.src('src/img/**/*.{png,jpg,svg}')
    .pipe(gulp.dest('build/img'))
}

// Copy

// const copy = (done) => {
//   gulp.src([
//     'src/fonts/*.{woff2,woff}',
//     'src/*.ico',
//   ], {
//     base: 'src'
//   })
//     .pipe(gulp.dest('build'))
//   done();
// }

// Clean

const clean = () => {
  return del('build');
};

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Reload

const reload = (done) => {
  browser.reload();
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('src/css/*.css', gulp.series(styles));
  gulp.watch('src/js/*.js', gulp.series(scripts));
  gulp.watch('src/*.html', gulp.series(html, reload));
}

// Default

export default gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    html,
    scripts
  ),
  gulp.series(
    server,
    watcher
  ));
