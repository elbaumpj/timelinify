var gulp = require("gulp"),
    awspublish = require('gulp-awspublish'),
    jf = require('jsonfile'),
    headers = { 'Cache-Control': 'max-age=315360000, no-transform, public' };

gulp.task('aws_timeline_production', function() {
  creds = jf.readFileSync("aws-timeline-production-creds.json")
  publisher = awspublish.create(creds)

  return gulp.src('./dist/{,*/}*{,*/}*.**')
    .pipe(publisher.publish(headers))
    .pipe(publisher.sync())
    .pipe(publisher.cache())
    .pipe(awspublish.reporter());
});
gulp.task('aws_timeline_staging', function() {
  creds = jf.readFileSync("aws-timeline-staging-creds.json")
  publisher = awspublish.create(creds)

  return gulp.src('./dist/{,*/}*{,*/}*.**')
    .pipe(publisher.publish(headers))
    .pipe(publisher.sync())
    .pipe(publisher.cache())
    .pipe(awspublish.reporter());
});


var rev = require("gulp-rev");
var revReplace = require("gulp-rev-replace");
gulp.task("revision", function(){
  return gulp.src(["dist/**/*.css", "dist/**/*.js"])
    .pipe(rev())
    .pipe(gulp.dest("dist"))
    .pipe(rev.manifest())
    .pipe(gulp.dest("dist"))
})

gulp.task("revreplace", ["revision"], function(){
  var manifest = gulp.src("./dist/rev-manifest.json");

  return gulp.src("dist/index.html")
    .pipe(revReplace({manifest: manifest}))
    .pipe(gulp.dest("dist"));
});
