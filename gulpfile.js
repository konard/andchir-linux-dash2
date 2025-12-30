const { src, dest, watch, series, parallel } = require('gulp')
const concat        = require('gulp-concat')
const uglify        = require('gulp-uglify')
const cleanCss      = require('gulp-clean-css')
const log           = require('fancy-log')
const ngAnnotate    = require('gulp-ng-annotate')
const templateCache = require('gulp-angular-templatecache')

function templateCacheTask() {
  return src('src/**/*.html')
    .pipe(templateCache('templates.js', {
        module: 'linuxDash',
        standAlone: false,
        root: 'src/'
      }))
    .pipe(dest('temp/'))
}

function generateJsDist() {
  return src([
    'node_modules/angular/angular.min.js',
    'node_modules/angular-route/angular-route.min.js',
    'node_modules/smoothie/smoothie.js',
    'node_modules/sortablejs/Sortable.min.js',
    'src/js/core/app.js',
    'src/js/**/*.js',
    'temp/templates.js'
  ])
  .pipe(concat('linuxDash.min.js'))
  .pipe(ngAnnotate())
  // .pipe(uglify())
  .on('error', log)
  .pipe(dest('app/'))
}

function generateCssDist() {
  return src([ 'src/**/*.css' ])
    .pipe(cleanCss())
    .pipe(concat('linuxDash.min.css'))
    .pipe(dest('app/'))
}

function watchFiles() {
  watch('src/**/*.css', generateCssDist)
  watch(['src/**/*.js', 'src/**/*.html'], series(templateCacheTask, generateJsDist))
}

const build = parallel(
  series(templateCacheTask, generateJsDist),
  generateCssDist
)

exports.templateCache = templateCacheTask
exports['generate-js-dist'] = series(templateCacheTask, generateJsDist)
exports['generate-css-dist'] = generateCssDist
exports.build = build
exports.watch = watchFiles
exports.default = series(build, watchFiles)
