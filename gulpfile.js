const gulp = require('gulp');
const less = require('gulp-less');
const babel = require('gulp-babel');
const imagemin = require('gulp-imagemin');
const LessAutoprefix = require('less-plugin-autoprefix');
const browserSync = require('browser-sync').create();
const autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] });

gulp.task('less', () => {
    gulp.src('./src/less/*.less')
        .pipe(less({
            plugins: [autoprefix]
          }).on('error', (e) => console.log(e)))
        .pipe(gulp.dest('./dist/css'));
}); 

gulp.task('babelEs6', () => {
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

gulp.task('watch', () => {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
    gulp.watch('./src/less/*.less', ['less']);
    gulp.watch('./src/images/*', ['imagemin']);
    gulp.watch('./src/js/*.js', ['babelEs6']);
    gulp.watch('dist/**/*').on('change', browserSync.reload);
    gulp.watch('dist/index.html').on('change', browserSync.reload);
});