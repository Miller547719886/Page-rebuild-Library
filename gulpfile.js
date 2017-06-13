/**
 *  @module 页面重构库
 *  @author Rufer <547719886@qq.com>
 *  @license GPL-3.0+
 *  @copyright © 2017 https://github.com/Miller547719886
 */

'use strict';

var gulp = require('gulp'),                         // gulp核心模块
	DEST = 'build',                                 // 编译目录 
	CSS_DEST = 'var/build/css',                         // css编译目录
	JS_DEST = 'var/build/js',                            // js编译目录
	IMG_DEST = 'var/build/img',                        // img编译目录
	HTML_DEST = 'var/build/',                       // html编译目录
	WEB_PORT = 80,
	concatCss = 'rufer.css',                               // 服务器监听的端口

	$ = require('gulp-load-plugins')();             // gulp插件加载模块
	
	// var sass = require('gulp-sass'),	              // sass与编译模块
	// 	jade = require('gulp-jade'),                  // jade与编译模块
	// 	autoprefixer = require('gulp-autoprefixer'), // 浏览器前缀自动补全
	// 	minifyCss = require('gulp-minify-css'),	    // 压缩css
	// 	minifyHtml = require("gulp-minify-html"),	// 压缩html
	// 	jshint = require('gulp-jshint'),             // js语法校验
	// 	browserify = require('gulp-browserify'),     // js模块化构建工具
	// 	uglify = require('gulp-uglify'),			 // 压缩js
	// 	imagemin = require('gulp-imagemin'),         // 压缩图片
	// 	spritesmith=require('gulp.spritesmith'),     // css sprite
	// 	rename = require('gulp-rename'),             // 文件重命名
	// 	clean = require('gulp-clean'),               // 文件清理
	// 	notify = require('gulp-notify'),             // 消息通知
	// 	cache = require('gulp-cache'),               // 缓存
	// 	sequence = require('gulp-sequence'),         // gulp任务执行队列
	// 	connect = require('gulp-connect'),           // node本地服务器
	// 	livereload = require('gulp-livereload');     // 浏览器即时刷新

// gulp-compass处理样式
gulp.task('styles-compass', function() {
    gulp.src(['share/scss/**/*.scss', 'share/spriteCSS/**/*.css', '!share/scss/**/_*.scss', '!share/scss/**/@*.scss'])
        .pipe($.compass({ // 這段內輸入config.rb的內容
            config_file: './config.rb',
            css: CSS_DEST, // compass輸出位置
            sass: 'share/scss', // sass來源路徑
            sourcemap: true, //compass 1.0 sourcemap
            style: 'compact', //CSS壓縮格式，預設(nested)
            comments: false, //是否要註解，預設(true)
            require: ['susy'] //額外套件 susy
        }))
        //.pipe(gulp.dest('')); // 輸出位置(非必要)
});

// gulp-sass处理样式
gulp.task('styles-sass', function() {
	return gulp.src(['share/scss/**/*.scss', 'share/spriteCSS/**/*.css', '!share/scss/**/_*.scss', '!share/scss/**/@*.scss'])
		.pipe($.sass())
		.pipe($.autoprefixer('last 2 version','safari 5','ie 8','ie 9','opera 12.1','ios 6','android 4'))
		.pipe($.minifyCss())
		// .pipe($.concat(concatCss))
		.pipe(gulp.dest(CSS_DEST))
		.pipe($.livereload())
		// .pipe($.notify({
		// 	message: 'Styles task complete'
		// }));
});

//处理jade-html
gulp.task('htmls', function() {
	return gulp.src(['share/jade/**/*.jade', '!share/jade/**/_*.jade', '!share/jade/**/@*.jade'])
		.pipe($.jade({pretty: '\t'}))
		// .pipe($.rename({
		// 	suffix: '.min'
		// }))
		// .pipe($.minifyHtml())
		.pipe($.htmlBeautify({
            indent_size: 4,
            indent_char: ' ',
            // 这里是关键，可以让一个标签独占一行
            unformatted: true,
            // 默认情况下，body | head 标签前会有一行空格
            extra_liners: []
        }))
		.pipe(gulp.dest(HTML_DEST))
		.pipe($.livereload())
		// .pipe($.notify({
		// 	message: 'Htmls task complete'
		// }))
});

// 处理javascript 
gulp.task('scripts', function() {
	return gulp.src('var/build/js/**/*.js')
		.pipe($.jshint('.jshintrc'))
		.pipe($.jshint.reporter('default'))
		.pipe($.browserify())
		.pipe(gulp.dest(JS_DEST))
		.pipe($.rename({
			suffix: '.min'
		}))
		.pipe($.uglify())
		.pipe(gulp.dest(JS_DEST))
		.pipe($.livereload())
		// .pipe($.notify({
		// 	message: 'Scripts task complete'
		// }));
});

// 处理图片
gulp.task('images', function() {
	return gulp.src(['share/img/**/*.*', '!share/img/sprite/**/*.*'])
		.pipe($.cache($.imagemin({
			optimizationLevel: 3,
			progressive: true,
			interlaced: true
		})))
		.pipe(gulp.dest(IMG_DEST))
		.pipe($.livereload())
		// .pipe($.notify({
		// 	message: 'Images task complete'
		// }))
});

// 压缩图片并合并雪碧图
var $spritesmith = require('gulp.spritesmith-multi'),
	$merge = require('merge-stream');

gulp.task('sprite', function() {
	var spriteData = gulp.src('share/img/sprite/**/*.*')
			.pipe($spritesmith({
				spritesmith: function (options, sprite) {
		            options.cssName = sprite + '.scss';
		            options.cssSpritesheetName = sprite;
		        }
			}));

	var imgStream = spriteData.img
      .pipe(gulp.dest('share/img'));

    var cssStream = spriteData.css
      .pipe(gulp.dest('share/spriteCSS'));

	return $merge(imgStream, cssStream);
});

// 清理build目录
gulp.task('clean', function() {
	return gulp.src([HTML_DEST + '/*.html', CSS_DEST + '/pages/*.css'/*, IMG_DEST + '/*.*'*/], {
		read: false
	})
	.pipe($.clean())
	// .pipe($.notify({
	// 	message: 'Clean task complete'
	// }));
});

// 设置服务器
gulp.task('http', function() {
    $.connect.server({
        root: DEST,
        port: WEB_PORT,
        livereload: true
    });
});

// 监听文件变化
gulp.task('watch', function() {

	// 监听livereload
	$.livereload.listen();

	// 监听sprite
	gulp.watch('share/img/sprite/**/*.*', ['sprite', 'images']);

	// 监听sass
	gulp.watch(['share/scss/**/*.scss','share/spriteCSS/**/*.css'], ['styles-sass'/*'styles-compass'*/]);

	// 监听js
	// gulp.watch('var/js/**/*.js', ['scripts']);

	// 监听图片
	gulp.watch(['share/img/**/*.*', '!share/img/sprite/**/*.*'], ['images']);

	// 监听html
	gulp.watch('share/jade/**/*.jade', ['htmls']);

});

// build任务
gulp.task('build', function(cb){
	$.sequence('clean',['sprite', /*'styles-compass',*/ 'styles-sass', /*'scripts',*/ 'images', 'htmls', 'watch'])(cb)
});

// 主任务
gulp.task('main', function(cb){
	$.sequence('build', ['http'])(cb)
});

// 默认任务
gulp.task('default',['main']);
