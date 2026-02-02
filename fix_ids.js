const fs = require('fs');
const path = require('path');

const contentPath = path.join(__dirname, 'src', 'data', 'content.json');
const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

function fixList(list) {
    if (!Array.isArray(list)) return;
    list.forEach(item => {
        if (item.id) {
            item.id = String(item.id).replace(/\./g, '');
        }
    });
}

fixList(content.tr.achievements_list);
fixList(content.en.achievements_list);

fs.writeFileSync(contentPath, JSON.stringify(content, null, 2));
console.log('Fixed IDs in content.json');
