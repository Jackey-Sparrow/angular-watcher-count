/**
 * Created by Jackey Li on 2015/8/14.
 */
var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    rename = require('gulp-rename');

gulp.task('build', function () {
    return gulp.src('src/*.js')
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('build'));
});

gulp.task('clean', function () {
    return gulp.src(['build/*.js'], {read: false})
        .pipe(clean({force: true}));
});

gulp.task('default', ['clean', 'build']);