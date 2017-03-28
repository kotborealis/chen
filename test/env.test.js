const expect = require('chai').expect;

const env = require('../lib/env');

describe('env parser', () => {
    const env_data = {
        num: '1',
        json: '{"a": 0}',
        string: 'yep!'
    };

    const parsed = env(env_data);

    console.log(parsed);

    it('should parse numbers', () => {
        expect(parsed.num).to.equal(1);
    });

    it('should parse json', () => {
        expect(parsed.json.a).to.equal(0);
    });

    it('should parse strings', () => {
        expect(parsed.string).to.equal('yep!');
    });
});