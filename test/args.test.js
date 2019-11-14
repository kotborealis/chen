const expect = require('chai').expect;

const args = require('../lib/args');

describe('arguments parser', () => {
    it('should parse params', () => {
        const argv = args('--param --param_a a --param_b b'.split(' '));
        expect(argv.param).equal(true);
        expect(argv.param_a).equal('a');
        expect(argv.param_b).equal('b');
    });

    it('should parse params with = as delimeter', () => {
        const argv = args('--param_a=a --param_b=2'.split(' '));
        expect(argv.param_a).equal('a');
        expect(argv.param_b).equal(2);
    });

    it('should parse params w/ numeric value', () => {
        const argv = args('--param_a 1 --param_b 3.14'.split(' '));
        expect(argv.param_a).equal(1);
        expect(argv.param_b).equal(3.14);
    });

    it('should parse params w/ "" values with spaces', () => {
        const argv = args(['--param_a', 'Program Files']);
        expect(argv.param_a).equal("Program Files");
    });

    it('should parse multiple params into array', () => {
        const _ = args(`--config a.js --config b.js`.split(' '));
        expect(_.config).to.eql(['a.js', 'b.js']);
    });

    it('should parse short flags', () => {
        const argv = args('-abc -d -e'.split(' '));
        expect(argv.a).equal(true);
        expect(argv.b).equal(true);
        expect(argv.c).equal(true);
        expect(argv.d).equal(true);
        expect(argv.e).equal(true);
    });

    it('should parse `free` args', () => {
        const argv = args('input.txt output.txt'.split(' '));
        expect(argv._).to.eql(['input.txt', 'output.txt']);
    });

    it('should parse `free` args inside "" with spaces', () => {
        const argv = args(['input.txt', 'output.txt', 'Program Files']);
        expect(argv._).to.eql(['input.txt', 'output.txt', 'Program Files']);
    });

    it('regression test', () => {
        const _ = args(`--vyf`.split(' '));
        expect(_.vyf).to.equal(true);
    });

    it('regression test', () => {
        const _ = args(`--faf --vyf`.split(' '));
        expect(_.faf).to.equal(true);
        expect(_.vyf).to.equal(true);
    });
    it('regression test', () => {
        const _ = args(`--faf --vyf`.split(' '));
        expect(_._).to.eql([]);
    });

    it('args frozen', () => {
        const _ = args([]);
        _.a = "test";
        _._.a = "test";
        expect(_.a).to.eql(undefined);
        expect(_._.a).to.eql(undefined);
    });
});