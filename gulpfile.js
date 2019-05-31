const fs = require('fs');
const {src, dest } = require('gulp');
const zip = require('gulp-zip');

const BUILD_PATH = './build';
const DIST_PATH = './dist';

async function generateDist() {
    createZip();
}

async function createZip() {
    const manifestPath = BUILD_PATH + '/manifest.json';
    const manifest = JSON.parse(fs.readFileSync(manifestPath));
    const {version} = manifest;
    const filename = `${version}-libplus.zip`;
    src((BUILD_PATH + '/*'))
        .pipe(zip(filename))
        .pipe(dest(DIST_PATH));
    console.log(`generated dist ${filename}`);
}

exports.generateDist = generateDist;
