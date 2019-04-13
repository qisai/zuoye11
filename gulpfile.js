var gulp = require("gulp");
var concat = require("gulp-concat");
var sass = require("gulp-sass");
var uglify = require("gulp-uglify");
var html = require("gulp-htmlmin");
var rename = require("gulp-rename");
var img = require('gulp-imagemin');
var webserver = require("gulp-webserver");

var url = require('url');
var path = require('path');
var fs = require('fs');


var list = require("./src/mock/list");
console.log(list);

//js合并，压缩，修改/添加后缀名
gulp.task("js", function() {
    return gulp.src('./src/js/*.js')
        .pipe(concat('all.js')) //合并
        .pipe(uglify()) //压缩
        .pipe(rename({
            suffix: ".min" //suffix：自动添加后缀名
        }))
        .pipe(gulp.dest("./dist/js/"))

})

//编译sass
gulp.task("sass", function() {
    return gulp.src('./src/sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest("./src/sass/"))
})

//css合并,压缩
// gulp.task("css",function () {
//     return 
// })

//压缩图片
gulp.task("img", function() {
    return gulp.src('./src/img/*.{jpg,jpeg}')
        .pipe(img())
        .pipe(gulp.dest("./dist/img/imagemin/"))
})

//压缩HTML
gulp.task("html", function() {
    return gulp.src('./src/*.html')
        .pipe(html({
            collapseWhitespace: true //压缩html
        })) //压缩
        .pipe(gulp.dest("./dist/"))

})

//起服务
gulp.task("webserver", function() {
    return gulp.src('./src/')
        .pipe(webserver({
            port: 8089,
            // open:true,
            host: "192.168.137.1",
            livereload: true,
            middleware: function(req, res, next) {
                    var pathname = url.parse(req.url).pathname;
                    console.log(pathname);
                    if (pathname === "/api/list") {
                        //设置响应头 -utf-8
                        res.setHeader("content-type", "text/plain;charset=utf-8");
                        res.end(JSON.stringify({ code: 1, data: list }))
                    } else {
                        pathname = pathname === "/" ? "index.html" : pathname;
                        res.end(fs.readFileSync(__dirname + "/src/" + pathname));
                    }
                }
                // proxies:[{
                //     source:"",target:""
                // }]
        }))
})

//监听scss文件的变化并执行sass命令执行编译
gulp.task('watch', function() {
    gulp.watch('./src/sass/*.scss', gulp.series('sass'))
})

//注册开发任务
gulp.task('dev', gulp.series("sass", "webserver", "watch"));

//注册线上任务
gulp.task('build', gulp.parallel("html", "img", "js"));