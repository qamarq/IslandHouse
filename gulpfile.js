const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
 
gulp.task('sass', () => {
    return gulp.src('./build/sass/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./public/css'))
});
 
gulp.task('watch', () => {
    gulp.watch('./build/sass/*.scss', gulp.series('sass'));
});