const test = require('tape');
const path = require('path');
const fse = require('fs-extra');
const perf2usfm = require('../../src/perf2usfm.js').default;

const testGroup = 'perf2usfm';

test(
    `lsg JON (${testGroup})`,
    async function (t) {
        try {
            const usfm = fse.readJsonSync(
                path.resolve(
                    path.join(__dirname, '..', 'test_data', 'fra_lsg_jon_doc.json')
                )
            )
            t.doesNotThrow(() => perf2usfm(usfm));
        } catch (err) {
            console.log(err);
        }
    },
);
