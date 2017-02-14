var gulp = require('gulp');               // 載入 gulp
var browserSync = require('browser-sync').create();

gulp.task('serve', function () {
    browserSync.init({
        proxy: "localhost:3000"   // hostname
    });
});

gulp.task('watch', function () {
    gulp.watch("css/*.css").on('change', browserSync.reload);
    gulp.watch("views/**/*.ejs").on('change', browserSync.reload);
});

gulp.task('default', ['serve', 'watch']);
