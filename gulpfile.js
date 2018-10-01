var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var runSequence = require('run-sequence');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var minifyCSS = require('gulp-minify-css');
var minify = require('gulp-minify');
var imagemin = require('gulp-imagemin');
var connect = require('gulp-connect-php');
var browserSync = require('browser-sync');

gulp.task('watch', function () {
    
	console.log('watch called');

    gulp.watch('assets/scss/*.scss',function(){
    	console.log('css file chaged');
    	runSequence('styles');
    });	

    gulp.watch('assets/js/*.js',function(){
    	console.log('js file chaged');
    	runSequence('js');
    });

    gulp.watch('assets/img/*',function(){
        console.log('img file chaged');
        runSequence('image-compress');
    });

    gulp.watch('**/*.php', function () {
        browserSync.reload();
    });
});


gulp.task('styles', function () {
  	gulp.src('assets/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({ browsers: ['last 10 versions'], cascade: false }))
    .pipe(sourcemaps.init())
    .pipe(minifyCSS())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/assets/css'))
});

gulp.task('js', function() {
	gulp.src('assets/js/*.js')
    .pipe(sourcemaps.init())
	.pipe(minify())
    .pipe(sourcemaps.write())
	.pipe(gulp.dest('dist/assets/js'))
});

gulp.task('image-compress', function(){
    gulp.src('assets/img/*')
    .pipe(imagemin({
        interlaced: true,
        progressive: true,
        optimizationLevel: 5,
        svgoPlugins: [{removeViewBox: true}]
    }))
    .pipe(gulp.dest('dist/assets/img'))
});

gulp.task('connect-sync', function() {
  connect.server({}, function (){
    browserSync({
      proxy: '127.0.0.1:8000'
    });
  });
});


gulp.task('start', ['styles', 'js', 'image-compress', 'connect-sync', 'watch'], function() {});