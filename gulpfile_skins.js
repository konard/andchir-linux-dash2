/**
 * Gulp build file for linux-dash skins.
 *
 * Usage:
 *   gulp --gulpfile gulpfile_skins.js          # Build all skins and watch
 *   gulp --gulpfile gulpfile_skins.js build    # Build all skins only
 *   gulp --gulpfile gulpfile_skins.js watch    # Watch for changes only
 */

var g       = require('gulp');
var concat  = require('gulp-concat');
var cssmin  = require('gulp-cssmin');
var gutil   = require('gulp-util');
var fs      = require('fs');
var path    = require('path');

var skinsDir = 'src/css/skins';
var distDir = 'app/skins';

/**
 * Get list of skin directories
 */
function getSkinDirs() {
    if (!fs.existsSync(skinsDir)) {
        return [];
    }
    return fs.readdirSync(skinsDir).filter(function(file) {
        return fs.statSync(path.join(skinsDir, file)).isDirectory();
    });
}

/**
 * Build a single skin
 */
function buildSkin(skinName) {
    var skinPath = path.join(skinsDir, skinName, '*.css');
    var outputFile = skinName + '.min.css';

    return g.src(skinPath)
        .pipe(cssmin())
        .pipe(concat(outputFile))
        .on('error', gutil.log)
        .pipe(g.dest(distDir));
}

/**
 * Build all skins
 */
g.task('build-skins', function(done) {
    // Ensure dist directory exists
    if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
    }

    var skins = getSkinDirs();

    if (skins.length === 0) {
        console.log('No skins found in ' + skinsDir);
        done();
        return;
    }

    console.log('Building skins:', skins.join(', '));

    var tasks = skins.map(function(skin) {
        return buildSkin(skin);
    });

    // Wait for all tasks to complete
    var completed = 0;
    tasks.forEach(function(task) {
        task.on('end', function() {
            completed++;
            if (completed === tasks.length) {
                done();
            }
        });
    });
});

/**
 * Watch for skin changes
 */
g.task('watch', function() {
    g.watch(skinsDir + '/**/*.css', ['build-skins']);
});

/**
 * Alias for build-skins
 */
g.task('build', ['build-skins']);

/**
 * Default task: build and watch
 */
g.task('default', ['build-skins', 'watch']);
