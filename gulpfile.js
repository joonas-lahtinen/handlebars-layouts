'use strict';

var gulp = require('gulp'),
	pkg = require('./package.json'),
	paths = {
		dest: './dist',
		gulp: './gulpfile.js',
		src: './index.js',
		test: './test/**/*.spec.js'
	};

gulp.task('default', ['build']);

gulp.task('lint', function () {
	var jscs = require('gulp-jscs'),
		jshint = require('gulp-jshint');

	return gulp
		.src([paths.gulp, paths.src, paths.test])
		.pipe(jscs())
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('cover', function () {
	var istanbul = require('gulp-istanbul');

	return gulp
		.src(paths.src)
		.pipe(istanbul());
});

gulp.task('test', ['cover'], function () {
	var istanbul = require('gulp-istanbul'),
		mocha = require('gulp-mocha');

	return gulp
		.src(paths.test)
		.pipe(mocha({ reporter: 'spec' }))
		.pipe(istanbul.writeReports());
});

gulp.task('build', ['lint', 'test'], function () {
	var browserify = require('browserify'),
		source = require('vinyl-source-stream');

	return browserify(paths.src)
		.bundle()
		.pipe(source(pkg.name + '.js'))
		.pipe(gulp.dest(paths.dest));
});