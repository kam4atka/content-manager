'use strict';

var gulp = require("gulp");
var del = require("del");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var sass = require("gulp-sass");
var csso = require("gulp-csso");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");

gulp.task("clean", () => {
  return del("build");
});

gulp.task("copy", () => {
  return gulp.src([
    "source/manifest.json",
    "source/img/**"
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"));
});

gulp.task("css-common", () => {
  return gulp.src("source/sass/main.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
});

gulp.task("css-mode", () => {
  return gulp.src("source/sass/cmanager.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
});

gulp.task("html", () => {
  return gulp.src("source/*.html")
    .pipe(gulp.dest("build"))
});

gulp.task("js-common", () => {
  return gulp.src("source/js/*.ts")
    .pipe(tsProject())
    .pipe(gulp.dest("build/js"))
});

gulp.task("build", gulp.series("clean", "copy", "css-common", "css-mode", "html", "js-common"));
