const expect = require('chai').expect;
const config = require('../lib/config');

describe('config loader', () => {
    it('basic', () => {
        const cfg = config({
            a: 1,
            b: 2
        });

        expect(cfg.a === 1);
        expect(cfg.b === 2);
    });

    it('multiple configs', () => {
        const cfg = config([{
            a: 1
        }, {
            b: 2
        }]);

        expect(cfg.a === 1);
        expect(cfg.b === 2);
    });

    it('config from file', () => {
        const cfg = config("./test/fixtures/config.js");

        expect(cfg.a === 1);
        expect(cfg.b === 2);
    });

    it('config from multiple files via default configs', () => {
        const cfg = config(["./test/fixtures/config.js", "./test/fixtures/override.js"]);

        expect(cfg.a === 1);
        expect(cfg.b === 10);
    });

    it('config from multiple files via args', () => {
        const cfg = config("./test/fixtures/config.js", {config: "./test/fixtures/override.js"});

        expect(cfg.a === 1);
        expect(cfg.b === 10);
    });

    it('config from multiple files via args even without defaults', () => {
        const cfg = config({}, {config: ["./test/fixtures/config.js", "./test/fixtures/override.js"]});

        expect(cfg.a === 1);
        expect(cfg.b === 10);
    });

    it('config frozen', () => {
        const cfg = config({a: []}, {});
        cfg.a.a = 1;
        expect(cfg.a.a).to.eql(undefined);
    });
});