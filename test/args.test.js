const expect = require('chai').expect;

const args = require('../lib/args');

describe('arguments parser', () => {
    const _ = args('non-hyphenated-1 --flag1 --flag2 -abc --value1 1 --value2 2 non-hyphenated-2'.split(' '));

    it('should parse flags', () => {
        expect(_).to.contain.all.keys('flag1', 'flag2');
        expect(_).to.contain.all.keys('a', 'b', 'c');
        expect(_.flag1).equal(true);
        expect(_.flag2).equal(true);
        expect(_.a).equal(true);
        expect(_.b).equal(true);
        expect(_.c).equal(true);
    });

    it('should parse values', () => {
        expect(_).to.contain.all.keys('value1', 'value2');
        expect(_.value1).equal(1);
        expect(_.value2).equal(2);
    });

    it('should parse non-hyphenated args', () => {
        expect(_).to.contain.all.keys('_');
        expect(_._).eql(['non-hyphenated-1', 'non-hyphenated-2']);
    });
});