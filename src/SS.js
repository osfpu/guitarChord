const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch();

    var chordsets = require('./chords.js').presetChords;

    for (var cs in chordsets) {
        if (cs !== 'Common') {
            for (var k in chordsets[cs]) {
                console.log("Starting get " + chordsets[cs][k]['name']);
                var chordName = chordsets[cs][k]['name'];
                var dir = './images/' + chordName;

                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }

                if (fs.existsSync(dir + '/.noChord') || fs.existsSync(dir + '/.done')) {
                    continue;
                }

                const page = await browser.newPage();
                await page.goto('http://localhost:3000/' + encodeURIComponent(chordName));
                await page.setViewport({
                    width: 4000,
                    height: 220
                });

                try {
                    await page.waitForSelector('svg', {
                        timeout: 3000
                    });
                } catch (exception) {
                    fs.writeFileSync(dir + '/.noChord', "");
                    console.log(exception);
                    continue;
                }

                const svgs = await page.$$('svg');

                for (var i = 0; i < svgs.length; i++) {
                    await page.screenshot({
                        path: dir + '/' + i.toString() + '.png',
                        clip: {
                            x: i * 200,
                            y: 0,
                            height: 220,
                            width: 200
                        }
                    });
                }

                fs.writeFileSync(dir + '/.done', "");
            }
        }
    }

    await browser.close();
})();