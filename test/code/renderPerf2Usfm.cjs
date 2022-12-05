import test from "tape";
import fse from "fs-extra";
import path from "path";
import { PerfRenderFromJson } from "../../src/index";
import toUsfmActions from "../../src/transforms/perf2usfm";

const testGroup = "Render Perf 2 USFM";

test(
    `PERF to USFM (${testGroup})`,
    async function (t) {
        try {
            t.plan(1);
            const perf = fse.readJsonSync(path.resolve(path.join(__dirname, '..', 'test_data', 'perfs', 'fra_lsg_mrk_perf_doc.json')));
            const cl = new PerfRenderFromJson({srcJson: perf, actions: toUsfmActions});
            const output = {};
            t.doesNotThrow(() => cl.renderDocument({docId: "", config: {}, output}));
            // console.log(output.usfm);
        } catch (err) {
            console.log(err);
        }
    },
);
