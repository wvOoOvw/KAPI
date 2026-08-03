const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '/build/[武将武] わずらいドミネーション [英文] [无修正] [DL版]');
const targetFile = path.join(__dirname, 'crawler.cartoon.js');

const files = fs.readdirSync(distDir);
const jpgFiles = files
  .filter(file => file.endsWith('.jpg'))
  .map(file => parseInt(path.basename(file, '.jpg'), 10))
  .filter(num => !isNaN(num))
  .sort((a, b) => a - b)

let content = fs.readFileSync(targetFile, 'utf8');

content = content.replace(
  /const shouldFilterIndes = \[.*?\]/s,
  `const shouldFilterIndes = [${jpgFiles.join(',')}]`
);

fs.writeFileSync(targetFile, content, 'utf8');
