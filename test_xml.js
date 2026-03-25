const { XMLParser } = require('fast-xml-parser');
const fs = require('fs');

async function testFetch() {
    const url = 'https://www.myjobmag.com/feeds/ng/jobsxml.xml';
    try {
        const res = await fetch(url);
        const xml = await res.text();
        const parser = new XMLParser();
        const obj = parser.parse(xml);
        const items = obj.rss?.channel?.item || obj.channel?.item || obj.feed?.entry || [];
        fs.writeFileSync('out.json', JSON.stringify(items.slice(0, 2), null, 2), 'utf8');
    } catch (e) {
        console.error(e);
    }
}

testFetch();
