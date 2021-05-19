var gulp = require('gulp');
var gutil = require('gulp-util');
var plugins = require('gulp-load-plugins')({
        rename: {
            'gulp-live-server': 'serve'
        }
    });

var gulp        = require('gulp');
var browserSync = require('browser-sync').create();

// Static Server + watching scss/html files
gulp.task('serve', ['css-mine'], function() {

    browserSync.init({
        server: "."
    });

    gulp.watch('less/**/*.less', ['css-mine']).on('change', browserSync.reload);
    gulp.watch("**/*.html").on('change', browserSync.reload);
});

gulp.task('default', ['watch']);

gulp.task('css-mine', function () {
    return gulp.src('less/*.less')
        .pipe(plugins.less())
        .on('error', function (err) {
            gutil.log(err);
            this.emit('end');
        })
        .pipe(plugins.autoprefixer({
            browsers: [
                    '> 1%',
                    'last 2 versions',
                    'firefox >= 4',
                    'safari 7',
                    'safari 8',
                    'IE 8',
                    'IE 9',
                    'IE 10',
                    'IE 11'
                ],
            cascade: false
        }))
        .pipe(gulp.dest('css')).on('error', gutil.log);
});

gulp.task('watch', function () {
    gulp.watch('less/**/*.less', ['css-mine']);
});