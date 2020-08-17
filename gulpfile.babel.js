const fs = require('fs');
const gulp = require('gulp');
const del = require('del');
const minify = require('gulp-minify');
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const zip = require('gulp-zip');
const dist = 'dist'

gulp.task('clean', () => {
    // You can use multiple globbing patterns as you would with `gulp.src`
    return del([dist + '/**', './archive.*']);
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

gulp.task('json', () => {
    return gulp.src('manifest.json')
        .pipe(gulp.dest(dist));
});

gulp.task('img', () => {
    return gulp.src(['./**/*.png'])
        .pipe(imagemin())
        .pipe(gulp.dest(dist))
});

gulp.task('cppkg', () => {
    return gulp.src('node_modules/viewerjs/**/*.min.*')
        .pipe(gulp.dest(dist + '/node_modules/viewerjs'))
});

gulp.task('cppkg2', () => {
    return gulp.src('node_modules/driver.js/**/*.min.*')
        .pipe(gulp.dest(dist + '/node_modules/driver.js'))
});

gulp.task('zip', () => {
    return gulp.src(dist + '/**/*')
        .pipe(zip('archive.zip'))
        .pipe(gulp.dest(dist))
});

gulp.task('cp', () => {
    return gulp.src(dist + '/archive.zip')
        .pipe(gulp.dest('./'))
});

gulp.task('xpi', gulp.series('zip', 'cp', done => {
    // rename
    fs.rename('./archive.zip', './archive.xpi', (err) => {
        if (err) throw err;
        console.log('renamed complete');
    });
    done()
}));

gulp.task('default', gulp.series('clean', 'img', 'css', 'js', 'json', 'cppkg', 'cppkg2', done => {
    console.log('done!')
    done()
}));