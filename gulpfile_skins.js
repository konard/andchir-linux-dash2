/**
 * Gulp build file for linux-dash skins.
 *
 * Usage:
 *   gulp --gulpfile gulpfile_skins.js          # Build all skins and watch
 *   gulp --gulpfile gulpfile_skins.js build    # Build all skins only
 *   gulp --gulpfile gulpfile_skins.js watch    # Watch for changes only
 */

const { src, dest, watch, series, parallel } = require('gulp');
const concat  = require('gulp-concat');
const cleanCss = require('gulp-clean-css');
const log     = require('fancy-log');
const fs      = require('fs');
const path    = require('path');

const skinsDir = 'src/css/skins';
const distDir = 'app/skins';

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
    const skinPath = path.join(skinsDir, skinName, '*.css');
    const outputFile = skinName + '.min.css';

    return src(skinPath)
        .pipe(cleanCss())
        .pipe(concat(outputFile))
        .on('error', log)
        .pipe(dest(distDir));
}

/**
 * Build all skins
 */
function buildSkins(done) {
    // Ensure dist directory exists
    if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
    }

    const skins = getSkinDirs();

    if (skins.length === 0) {
        console.log('No skins found in ' + skinsDir);
        done();
        return;
    }

    console.log('Building skins:', skins.join(', '));

    const tasks = skins.map(function(skin) {
        return buildSkin(skin);
    });

    // Wait for all tasks to complete
    let completed = 0;
    tasks.forEach(function(task) {
        task.on('end', function() {
            completed++;
            if (completed === tasks.length) {
                done();
            }
        });
    });
}

/**
 * Watch for skin changes
 */
function watchSkins() {
    watch(skinsDir + '/**/*.css', buildSkins);
}

/**
 * Export tasks
 */
exports['build-skins'] = buildSkins;
exports.build = buildSkins;
exports.watch = watchSkins;
exports.default = series(buildSkins, watchSkins);
