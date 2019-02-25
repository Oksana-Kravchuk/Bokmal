const gulp         = require('gulp');
const sass         = require('gulp-sass');
const watchSass    = require("gulp-watch-sass");
const autoprefixer = require('gulp-autoprefixer');
const cssnano      = require('gulp-cssnano');
const rename       = require("gulp-rename");
const sourcemaps   = require('gulp-sourcemaps');
const plumber      = require('gulp-plumber');
const notify       = require("gulp-notify");
const fileinclude  = require('gulp-file-include');
const babel        = require('gulp-babel');
const include      = require("gulp-include");
const uglify 		   = require('gulp-uglify');
const browserSync  = require('browser-sync').create();
const runSequence  = require('run-sequence');
const imagemin     = require('gulp-imagemin');
const del          = require('del');
const jquery       = require('gulp-jquery');
const svgSprite    = require('gulp-svg-sprite');
const svgmin       = require('gulp-svgmin');
const cheerio      = require('gulp-cheerio');
const replace      = require('gulp-replace');
const csscomb      = require('gulp-csscomb');

gulp.task('sass', function () {
	return gulp.src([
        'app/sass/main.sass'
        ])
	.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
	.pipe(sourcemaps.init())
	.pipe(sass().on('error', sass.logError))
	.pipe(autoprefixer({
		browsers: ['last 2 versions'],
		cascade: false
	}))
	.pipe(cssnano())
	.pipe(rename({
        dirname: "",
    // basename: "main",
    prefix: "",
    suffix: ".min",
    extname: ".css"
}))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('dist/css'));
});

gulp.task('styles', function() {
  return gulp.src('src/styles/main.css')
    .pipe(csscomb())
    .pipe(gulp.dest('./build/css'));
});

gulp.task('html', function () {
  return gulp.src('app/*.html')
  .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
  .pipe(fileinclude({
    prefix: '@@',
    basepath: '@file'
}))
  .pipe(gulp.dest('dist'));
});

gulp.task('js', function () {
	return gulp.src('app/js/**/*.*')
	.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
	.pipe(sourcemaps.init({loadMaps: true}))
	.pipe(babel({
     presets: ['env']
  }))
	.pipe(include({
        extensions: "js",
        hardFail: true
    }))
  .pipe(uglify())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('dist/js'));
});


gulp.task('server', function() {
  browserSync.init({
    server: {
      baseDir: "./dist"
  },
  files: ['dist/**/*.*']
});
});

gulp.task('clean', function() {
  return del(['dist/'])
})
gulp.task('build', ['clean'], function() {
  runSequence(
    'sass',
    'html',
    'js',
    'fonts',
    'img',
    'svgSpriteBuild'
    );
});

gulp.task('fonts', function () {
  return gulp.src('app/fonts/**/*.*')
  .pipe(gulp.dest('dist/fonts'));
});

gulp.task('img', function () {
  gulp.src([
    "app/img/**/*.jpg*",
    "app/img/noCompress/**/*.*"
    ])
  .pipe(gulp.dest('dist/img'));
  gulp.src('app/img/noCompress/**/*.*')
  .pipe(imagemin([
    imagemin.gifsicle({interlaced: true}),
    imagemin.jpegtran({progressive: true}),
    imagemin.optipng({optimizationLevel: 5}),
    imagemin.svgo({
      plugins: [
      {removeViewBox: false},
      {cleanupIDs: false}
      ]
  })
    ]))
  .pipe(gulp.dest('dist/img'))
});


gulp.task('svgSpriteBuild', function () {
    return gulp.src('app/img/svg/*.svg')
        .pipe(svgmin({
            js2svg: {
                pretty: true
            }
        }))
        .pipe(cheerio({
            parserOptions: { xmlMode: true }
    }))
        .pipe(replace('&gt;', '>'))
        .pipe(svgSprite({
           mode: {
            view: {
                bust: false,
                render: {
                  scss: false
                },
                dest : '.'
              },
              symbol: {
                  dest : '.'
                    }
              }
        }))
        .pipe(gulp.dest('dist/img'));
});


gulp.task('libs', function () {
  gulp.src('app/js/libs/**/*.js')
  .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
  .pipe(babel())
  .pipe(include({
    extensions: "js",
    hardFail: true
}))
  .pipe(gulp.dest('dist/js'));
  gulp.src('app/css/libs/**/*.css')
  .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
  .pipe(include({
    extensions: "css",
    hardFail: true
}))
  .pipe(gulp.dest('dist/css'));
});

gulp.task('watch', function () {
	gulp.watch('app/sass/**/*.*', ['sass']);
	gulp.watch('app/**/*.html', ['html']);
	gulp.watch('app/js/**/*.js', ['js']);
	gulp.watch('app/fonts/**/*.*', ['fonts']);
	gulp.watch('app/img/**/*.*', ['img']);
  gulp.watch('app/js/libs/**/*.*', ['libs']);
});

gulp.task('default', function() {
  runSequence(
    'build',
    'watch',
    'server'
    );
});