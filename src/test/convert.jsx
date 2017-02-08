var gulp = require('gulp');
var babel = require('gulp-babel');

gulp.task("babel", function () {
    return gulp.src("src/app/components/user/register.jsx").
        pipe(babel({
            plugins: ['transform-react-jsx']
        })).
        pipe(gulp.dest("src/test/"));
});