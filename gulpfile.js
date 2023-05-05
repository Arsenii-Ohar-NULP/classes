const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));

gulp.task('sass', (cb) => {
    gulp
        .src('*.scss')
        .pipe(sass())
        .pipe(
            gulp.dest((f) => f.base),
        );
    cb();
});

gulp.task(
    'default',
    gulp.series('sass', (cb) => {
        gulp.watch('*.scss', gulp.series('sass'));
        cb();
    }),
);
