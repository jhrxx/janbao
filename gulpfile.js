const fs = require('fs');
const gulp = require('gulp');
const del = require('del'),
    minify = require('gulp-minify'),
    cleanCSS = require('gulp-clean-css'),
    imagemin = require('gulp-imagemin'),
    zip = require('gulp-zip')

const dist = 'dist'

gulp.task('clean', (cb) => {
    // You can use multiple globbing patterns as you would with `gulp.src`
    return del([dist + '/**'], cb);
});


gulp.task('css', () => {
    return gulp.src(['./*.css'])
        .pipe(cleanCSS())
        .pipe(gulp.dest(dist));
});

gulp.task('js', () => {
    return gulp.src(['./*.js', '!gulpfile.js'])
        .pipe(minify({
            noSource: true,
            ext: {
                min: '.js'
            }
        }))
        .pipe(gulp.dest(dist))
});

gulp.task('json',  ()=> {
    return gulp.src('manifest.json')
        .pipe(gulp.dest(dist));
});

gulp.task('img', () => {
    return gulp.src(['./**/*.png'])
        .pipe(imagemin())
        .pipe(gulp.dest(dist))
});

gulp.task('zip', () => {
    return gulp.src(dist + '/*')
        .pipe(zip(dist + '.zip'))
        .pipe(gulp.dest())
});

gulp.task('rename', () => {
    fs.rename(dist + '/' + dist + '.zip', dist + '/' + dist + '.xpi', function (err) {
        if (err) throw err;
        console.log('renamed complete');
    });
});

gulp.task('default', ['clean'], function () {
    gulp.start(['img', 'css', 'js', 'json']);
});

gulp.task('ff', ['zip'], function () {
    gulp.start(['rename']);
});