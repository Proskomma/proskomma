import test from 'tape';

const fse = require('fs-extra');
import path from 'path';
import ProskommaRenderFromJson from '../../src/ProskommaRenderFromJson';
import identityActions from '../../src/identityActions';
import wordCountActions from '../../src/wordCountActions';
import wordSearchActions from '../../src/wordSearchActions';
import longVerseCheckActions from '../../src/longVerseCheckActions';
import mergeActions from '../../src/mergeActions';
import equal from 'deep-equal';

const testGroup = 'Render from JSON';

test(
    `Instantiate class (${testGroup})`,
    async function (t) {
        try {
            t.plan(1);
            t.doesNotThrow(() => new ProskommaRenderFromJson({srcJson: {}}));
        } catch (err) {
            console.log(err);
        }
    },
);

test(
    `Render PERF with empty actions (${testGroup})`,
    async function (t) {
        try {
            t.plan(1);
            const perf = fse.readJsonSync(path.resolve(path.join(__dirname, '..', 'test_data', 'validation', 'valid_flat_document.json')));
            const cl = new ProskommaRenderFromJson({srcJson: perf});
            t.doesNotThrow(() => cl.renderDocument({docId: "", config: {}, output: {}}));
        } catch (err) {
            console.log(err);
        }
    },
);

test(
    `Follow PERF grafts (${testGroup})`,
    async function (t) {
        try {
            t.plan(1);
            const perf = fse.readJsonSync(path.resolve(path.join(__dirname, '..', 'test_data', 'fra_lsg_mrk_perf_doc.json')));
            const cl = new ProskommaRenderFromJson({srcJson: perf});
            cl.debugLevel = 0;
            cl.addRenderAction(
                'blockGraft',
                {
                    description: "Follow all block grafts",
                    action: (environment) => {
                        const context = environment.context;
                        const blockContext = context.sequences[0].block;
                        if (blockContext.target) {
                            context.renderer.renderSequenceId(environment, blockContext.target);
                        }
                    }
                }
            );
            cl.addRenderAction(
                'inlineGraft',
                {
                    description: "Follow all inline grafts",
                    action: (environment) => {
                        const context = environment.context;
                        const elementContext = context.sequences[0].element;
                        if (elementContext.target) {
                            context.renderer.renderSequenceId(environment, elementContext.target);
                        }
                    }
                }
            );
            t.doesNotThrow(() => cl.renderDocument({docId: "", config: {}, output: {}}));
        } catch (err) {
            console.log(err);
        }
    },
);

test(
    `Follow metaContent (${testGroup})`,
    async function (t) {
        try {
            t.plan(1);
            const perf = fse.readJsonSync(path.resolve(path.join(__dirname, '..', 'test_data', 'validation', 'valid_flat_document.json')));
            const cl = new ProskommaRenderFromJson({srcJson: perf});
            cl.debugLevel = 0;
            cl.addRenderAction(
                'metaContent',
                {
                    description: "Follow metaContent",
                    action: (environment) => {
                        const context = environment.context;
                        const elementContext = context.sequences[0].element;
                        context.renderer.renderContent(elementContext.metaContent, environment);
                    }
                }
            );
            t.doesNotThrow(() => cl.renderDocument({docId: "", config: {}, output: {}}));
        } catch (err) {
            console.log(err);
        }
    },
);
/*
test(
    `Render PERF with identity actions (${testGroup})`,
    async function (t) {
        try {
            t.plan(2);
            const perf = fse.readJsonSync(path.resolve(path.join(__dirname, '..', 'test_data', 'validation', 'valid_flat_document.json')));
            const cl = new ProskommaRenderFromJson({srcJson: perf, actions: identityActions});
            const output = {};
            t.doesNotThrow(() => cl.renderDocument({docId: "", config: {}, output}));
            // console.log(JSON.stringify(output, null, 2));
            t.ok(equal(perf, output));
        } catch (err) {
            console.log(err);
        }
    },
);
*/
test(
    `PERF word count (${testGroup})`,
    async function (t) {
        try {
            t.plan(1);
            const perf = fse.readJsonSync(path.resolve(path.join(__dirname, '..', 'test_data', 'fra_lsg_mrk_perf_doc.json')));
            const cl = new ProskommaRenderFromJson({srcJson: perf, actions: wordCountActions});
            const output = {};
            t.doesNotThrow(() => cl.renderDocument({docId: "", config: {}, output}));
        } catch (err) {
            console.log(err);
        }
    },
);

test(
    `PERF word search (${testGroup})`,
    async function (t) {
        try {
            t.plan(1);
            const perf = fse.readJsonSync(path.resolve(path.join(__dirname, '..', 'test_data', 'fra_lsg_mrk_perf_doc.json')));
            const cl = new ProskommaRenderFromJson({srcJson: perf, actions: wordSearchActions});
            const output = {};
            t.doesNotThrow(() => cl.renderDocument({docId: "", config: {toSearch: "foule"}, output}));
        } catch (err) {
            console.log(err);
        }
    },
);

test(
    `PERF long verse check (${testGroup})`,
    async function (t) {
        try {
            t.plan(1);
            const perf = fse.readJsonSync(path.resolve(path.join(__dirname, '..', 'test_data', 'fra_lsg_mrk_perf_doc.json')));
            const cl = new ProskommaRenderFromJson(
                {
                    srcJson: perf,
                    actions: mergeActions(
                        [
                            longVerseCheckActions,
                            identityActions,
                        ]
                    )
                }
            );
            const output = {};
            t.doesNotThrow(() => cl.renderDocument({docId: "", config: {}, output}));
        } catch (err) {
            console.log(err);
        }
    },
);
