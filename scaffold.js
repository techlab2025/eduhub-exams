const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src/modules/privacy');
const destDir = path.join(__dirname, 'src/modules/terms-conditions');

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function processContent(content) {
    let newContent = content.replace(/privacy/g, 'terms-conditions');
    newContent = newContent.replace(/Privacy/g, 'TermsConditions');
    newContent = newContent.replace(/PRIVACY/g, 'TERMS_CONDITIONS');
    return newContent;
}

function traverse(currentSrc, currentDest) {
    ensureDir(currentDest);
    const files = fs.readdirSync(currentSrc);

    for (const file of files) {
        if (file === 'node_modules') continue;

        const srcPath = path.join(currentSrc, file);
        
        let newFile = file.replace(/privacy/g, 'terms-conditions');
        newFile = newFile.replace(/Privacy/g, 'TermsConditions');
        
        const destPath = path.join(currentDest, newFile);

        const stat = fs.statSync(srcPath);

        if (stat.isDirectory()) {
            traverse(srcPath, destPath);
        } else {
            const content = fs.readFileSync(srcPath, 'utf8');
            const processedContent = processContent(content);
            fs.writeFileSync(destPath, processedContent);
        }
    }
}

traverse(srcDir, destDir);
console.log('Copy and rename successful');
