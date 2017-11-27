var gulp         = require('gulp'),
		sass         = require('gulp-sass'), // Sass компілятор в css
		concat       = require('gulp-concat'), // З'єднує (конкатенує) файли
		spritesmith  = require('gulp.spritesmith'), // Генерація спрайта
		autoprefixer = require('autoprefixer'), // PostCss autoprefixer - автоматично формує вендорні префікси
		cssmin       = require('gulp-cssmin'), // Мініфікація css
		rename       = require('gulp-rename'), // Перейменування файлу
		postcss      = require('gulp-postcss'), // PostCss
		mqpacker     = require('css-mqpacker'), // Збирає всі медіа-запити в одному місці
		imagemin     = require('gulp-imagemin'),
		svgstore     = require('gulp-svgstore'),
		svgmin       = require('gulp-svgmin'),
		del          = require('del'), // Видаляє папки, файли
		run          = require('run-sequence'), // Запускає послідовно задачі
		plumber      = require('gulp-plumber'), // Відслідковування і вивід в консоль помилок
		notify       = require("gulp-notify"), // Вивід повідомлення про помилку
		cheerio      = require('gulp-cheerio'),
		browserSync  = require('browser-sync').create(); // Сервер

// Static server
gulp.task('browser-sync', function() {
	browserSync.init({
		// server: {
		// 	baseDir: 'app'
		// },
		proxy: "akordmebli.loc",
		// tunnel: 'akord',
		notify: false
	});
});


gulp.task('styles', function() {
	return gulp.src('app/sass/style.sass')
	.pipe(plumber())
	.pipe(sass({outputStyle: 'nested'}).on('error', notify.onError()))
	.pipe(postcss([
			autoprefixer({
				browsers: ['last 15 versions'],
				cascade: false
			}),
			mqpacker({
				sort: true
			})
		]))
	.pipe(gulp.dest('app/css'))
	.pipe(cssmin())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('../akordmebli/assets/css'))
	.pipe(browserSync.stream());
});

gulp.task('script', function() {
	gulp.src([
		// 'app/libs/jquery/jquery-3.2.1.min.js',
		'app/libs/waypoint/jquery.waypoints.min.js',
		'app/libs/counter/counterup.min.js',
		'app/libs/owl-carousel/owl.carousel.min.js',
		// 'app/libs/owl-carousel/owl.carousel2.thumbs.min.js',
		'app/libs/slick-slider/slick.min.js',
		'app/libs/fancybox/jquery.fancybox.min.js',
		'app/libs/input-mask/jquery.mask.min.js',
		'app/libs/equalheight/matchheight.js',
		'app/libs/animate-css/animate-css.js',
		'app/libs/easyzoom/easyzoom.js',
		'app/libs/isotope/isotope.pkgd.min.js'
		])
	.pipe(concat('scripts.min.js'))
	.pipe(gulp.dest('../akordmebli/assets/js'))
	.pipe(browserSync.stream());
});

gulp.task('sprite', function() {
	var spriteData = gulp.src('app/img/sprite/*.png')
		.pipe(spritesmith({
		/* this whole image path is used in css background declarations */
		imgName: 'sprite.png',
		cssName: 'sprite.sass',
		padding: 2
		}));
	spriteData.img.pipe(gulp.dest('app/img'));
	spriteData.css.pipe(gulp.dest('app/sass'));
});


gulp.task('symbols', function() {
	return gulp.src('app/img/icon/*.svg')
		.pipe(svgmin())
		.pipe(svgstore({
			inlineSvg: true
		}))
		.pipe(cheerio({
			run: function($) {
				$('[fill]').removeAttr('fill');
				$('[style]').removeAttr('style');
				$('[class]').removeAttr('class');
				$('title').remove();
				$('defs').remove();
				$('style').remove();
				$('svg').attr('style', 'display:none');
			}
		}))
		.pipe(rename('symbols.html'))
		.pipe(gulp.dest('../akordmebli/assets/img'));
});

gulp.task('watch', function() {
	gulp.watch('app/sass/**/*.sass', ['styles']);
	gulp.watch('app/*.html').on("change", browserSync.reload);
	gulp.watch('app/**/*.php').on("change", browserSync.reload);
	gulp.watch('app/libs/**/*.js', ['script']);
	gulp.watch('app/js/common.js').on("change", browserSync.reload);
});


/* Project transfer to prodaction */
gulp.task('clean', function() {
	return del.sync('dist');
});

gulp.task('images', function() {
	return gulp.src('app/img/**/*.{png,jpg,gif,ico}')
		.pipe(imagemin([
			imagemin.optipng({optimizationLevel: 3}),
			imagemin.jpegtran({progressive: true})
		]))
		.pipe(gulp.dest('dist/img'))
});

gulp.task('svg', function() {
	return gulp.src('app/img/*.svg')
		.pipe(svgmin())
		.pipe(gulp.dest('dist/img'));
});

gulp.task('build', ['clean', 'styles', 'images', 'svg'], function(){
	gulp.src(['app/css/style.min.css'])
		.pipe(gulp.dest('dist/css'));

	gulp.src(['app/fonts/**/*'])
		.pipe(gulp.dest('dist/fonts'));

	gulp.src(['app/js/**/*'])
		.pipe(gulp.dest('dist/js'));

	gulp.src(['app/img/symbols.html'])
		.pipe(gulp.dest('dist/img'));

	gulp.src(['app/*.html'])
		.pipe(gulp.dest('dist'));
});


gulp.task('default', ['styles', 'script', 'browser-sync', 'watch']);