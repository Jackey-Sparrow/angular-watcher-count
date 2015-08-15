/**
 * Created by Jackey Li on 2015/8/14.
 */
    
var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    rename = require('gulp-rename'),
    karma = require('gulp-karma');

gulp.task('build-min', function () {
    return gulp.src('src/*.js')
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('build'));
});

gulp.task('build', function () {
    return gulp.src('src/*.js')
        .pipe(gulp.dest('build'));
});

gulp.task('runTest',function(){
    return gulp.src('test/watcher-spec.js')
        .pipe(karma({
            configFile:'test/karma.conf.js',
            action:'run'
        }))
        .on('error', function (err) {
            throw err;
        });
});

gulp.task('clean', function () {
    return gulp.src(['build/*.js'], {read: false})
        .pipe(clean({force: true}));
});

//gulp.task('default', ['clean', 'build','build-min','runTest']);
gulp.task('default', ['clean', 'build','build-min']);