const { src, dest, series, watch } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const csso = require("gulp-csso");
const include = require("gulp-file-include");
const htmlmin = require("gulp-htmlmin");
const del = require("del");
const concat = require("gulp-concat");
const autoprefixer = require("gulp-autoprefixer");
const sync = require("browser-sync").create();
const minify = require("gulp-minify");
const gulp = require("gulp");

function html() {
    return src("src/**.html")
        .pipe(
            include({
                prefix: "@@",
            })
        )
        .pipe(
            htmlmin({
                collapseWhitespace: true,
                removeComments: true,
            })
        )
        .pipe(dest("dist"));
}

function scss() {
    return src("src/style/**.scss")
        .pipe(sass())
        .pipe(autoprefixer("last 2 versions"))
        .pipe(csso())
        .pipe(concat("style.css"))
        .pipe(dest("dist"));
}

function pic() {
    return src("src/img/**.{jpeg,jpg,gif,png}").pipe(dest("dist/img"));
}

// function section_2() {
//     return src("src/img/section-2/**.{jpeg,jpg,gif,png}").pipe(
//         dest("dist/img/section-2")
//     );
// }

async function clear() {
    del("dist");
}

function jsmini() {
    return src("src/js/*.js", "src/js/*.mjs")
        .pipe(
            minify({
                noSource: true,
            })
        )
        .pipe(dest("dist/js"));
}

function serve() {
    sync.init({
        server: "./dist",
    });

    watch("src/**.html", series(html)).on("change", sync.reload);
    watch("src/parts/**.html", series(html)).on("change", sync.reload);
    watch("src/style/**.scss", series(scss)).on("change", sync.reload);
    watch("src/js/**.js", series(jsmini)).on("change", sync.reload);
    watch("src/img/**.{jpeg,jpg,gif,png}", series(pic)).on("change", sync.reload);
    // watch("src/img/section-2/**.{jpeg,jpg,gif,png}", series(section_2)).on(
    //     "change",
    //     sync.reload
    // );
}

exports.start = series(clear, html, jsmini, scss, pic, serve);

exports.reload = series(html, scss, jsmini, pic, serve);

exports.delete = series(clear);