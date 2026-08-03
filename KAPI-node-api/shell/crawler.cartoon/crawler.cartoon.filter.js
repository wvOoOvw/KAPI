const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '/build/[圣华快楽书店(エルトリア)] セックスレベリング 〜魅了スキルでNTRを仕挂けてきたグラビアアイドルにガチ惚れされて溺爱JKと一绪にハーレム3Pする话〜');
const targetFile = path.join(__dirname, 'crawler.cartoon.js');

const files = fs.readdirSync(distDir);
const jpgFiles = files.filter(file => file.endsWith('.jpg')).map(i => i.replace('.jpg', '')).map(i => "'" + i + "'");

let content = fs.readFileSync(targetFile, 'utf8');

content = content.replace(/imagesFilter = \[.*?\]/s,`imagesFilter = [${jpgFiles.join(',')}]`);

fs.writeFileSync(targetFile, content, 'utf8');
