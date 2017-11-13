// Include gulp
var gulp = require('gulp');

// Include plugins
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var csslint = require('gulp-csslint');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var runSequence = require('run-sequence');
var util = require('gulp-util');
var es = require('event-stream');
var clean = require('gulp-clean');

// output dir
var production = !!util.env.production;
var outputDir =  production ? 'build' : 'dev';
var tasksList = ['js','css'];
if(!production) tasksList.push('watch');


var cssBundles = [
		{
			src : ['src/css/commons/bootstrap.css','src/css/commons/toastr.css','src/css/commons/style.css','src/css/commons/buttons.css','src/css/commons/header.css','src/css/commons/menu.css','src/css/commons/search.css','src/css/commons/card.css','src/css/commons/widgets.css','src/css/commons/subscribePopup.css','src/css/commons/pager.css','src/css/commons/footer.css'],
			output : 'base'
		},
		{
			src : ['src/css/hompage.css'],
			output : 'homepage'
		},
		{
			src : ['src/css/category.css'],
			output : 'category'
		},
		{
			src : ['src/css/single.css','src/css/share.css'],
			output : 'single'
		},
		{
			src : ['src/css/myspace.css'],
			output : 'myspace'
		},
		{
			src : ['src/css/community.css'],
			output : 'community'
		},
		{
			src : ['src/css/chat.css'],
			output : 'chat'
		},
		{
			src : ['src/css/tools.css'],
			output : 'tools'
		},
		{
			src : ['src/js/coupon.css'],
			output : 'coupon'
		},
		{
			src : ['src/js/zencorner.css'],
			output : 'zencorner'
		},
		{
			src : ['src/js/portal.css'],
			output : 'portal'
		},
		{
			src : ['src/js/profile.css'],
			output : 'profile'
		},
		{
			src : ['src/css/baby-names.css'],
			output : 'baby-names'
		}
];

var jsBundles = [
	{
		src : ['src/js/jquery.js','src/js/bootstrap.js','src/js/toastr.js','src/js/commons.js','src/js/clevertap-analytics.js','src/js/user-actions.js'],
		output : 'base'
	},
	{
		src : ['src/js/category.js'],
		output : 'category'
	},
	{
		src : ['src/js/homepage.js'],
		output : 'homepage'
	},
	{
		src : ['src/js/tools.js'],
		output : 'tools'
	},
	{
		src : ['src/js/community.js'],
		output : 'community'
	},
	{
		src : ['src/js/chatroom.js'],
		output : 'chatroom'
	},
	{
		src : ['src/js/coupon.js'],
		output : 'baby-names'
	},
	{
		src : ['src/js/baby-names.js'],
		output : 'baby-names'
	},
	{
		src : ['src/js/user-profile.js'],
		output : 'user-profile'
	}

];


function jsLint(srcFiles=[]){
	return gulp.src(srcFiles)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
}

function cssLint(srcFiles=[]){
	return gulp.src(srcFiles)
	    .pipe(csslint())
	    .pipe(csslint.formatter());
	
}

function jsBuild(srcFiles=[],outputFileName=''){
	return gulp.src(srcFiles)
        .pipe(concat(outputFileName+'.js'))
        .pipe(gulp.dest(outputDir+'/js'))
        .pipe(production ? rename(outputFileName+'.min.js') : util.noop())
        .pipe(production ? uglify() : util.noop())
        .pipe(gulp.dest(outputDir+'/js'));
}

function cssBuild(srcFiles=[],outputFileName=''){
	return gulp.src(srcFiles)
 	  .pipe(autoprefixer())
      .pipe(concat(outputFileName+'.css'))
	  .pipe(gulp.dest(outputDir+'/css'))
      .pipe(production ? rename(outputFileName+'.min.css') : util.noop())
      .pipe(production ? cleanCSS({compatibility: 'ie9'}) : util.noop())
      .pipe(gulp.dest(outputDir+'/css'));
}

// run js and css lint
gulp.task('jsLint',['clean'],function () {
	return jsBundles.map(function(bundle){
		return jsLint(bundle.src);	
	});
});

gulp.task('cssLint',function() {
	return cssBundles.map(function(bundle){
		return cssLint(bundle.src);
	});
});

// JS Build
gulp.task('jsBuild',function(){
	return es.merge(jsBundles.map(function(bundle){
		return jsBuild(bundle.src,bundle.output);	
	}));
	
});

// CSS Build
gulp.task('cssBuild',function(){
	return es.merge(cssBundles.map(function(bundle){
		return cssBuild(bundle.src,bundle.output);
	}));
});

gulp.task('clean',function(){
	return gulp.src(['dev/js','dev/css','build/js','build/css']).pipe(clean());
});

gulp.task('js',['jsBuild']);
gulp.task('css', ['cssBuild']);

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('src/js/*', ['js']);
    gulp.watch('src/css/*',['css']);
});

// Default Task
gulp.task('default', tasksList);