const gulp = require('gulp');
const babel = require('gulp-babel');
const imagemin = require('gulp-imagemin');
const LessAutoprefix = require('less-plugin-autoprefix');
const browserSync = require('browser-sync').create();
const autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] });
var uglify = require('gulp-uglify');
 
gulp.task('compile', () => {
    gulp.src('./src/js/*.js')
        .pipe(babel({
            presets: ['es2015']
        }).on('error', err => console.log(err)))
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('imagemin', () =>
    gulp.src('./src/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/images'))
);

gulp.task('jsmin', function () {
    gulp.src('dist/js/*.js') 
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('watch', () => {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
    gulp.watch('./src/images/*', ['imagemin']);
    gulp.watch('./src/js/*.js', ['compile']);
    gulp.watch('dist/**/*').on('change', browserSync.reload);
    gulp.watch('dist/index.html').on('change', browserSync.reload);
});