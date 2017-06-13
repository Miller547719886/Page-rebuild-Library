// var imagemin = require('gulp-imagemin');         // 压缩图片

module.exports = function (gulp, Plugin, config) {
    gulp.task('img', function() {
        return gulp.src('./img/unminified/**/*.*')
            .pipe(Plugin.imagemin({
                optimizationLevel: 2,
                progressive: true

            }))
            .pipe(gulp.dest('./imagemini'))
    });
};