const expect = require('chai').expect;

const env = require('../lib/env');

describe('env parser', () => {
    const env_data = {
        num: '1',
        json: '{"a": 0}',
        string: 'yep!'
    };

    const parsed = env(env_data);

    it('should parse numbers', () => {
        expect(parsed.num).to.equal(1);
    });

    it('should parse json', () => {
        expect(parsed.json.a).to.equal(0);
    });

    it('should parse strings', () => {
        expect(parsed.string).to.equal('yep!');
    });

    it('should user dotenv to parse .env file', () => {
        expect(parsed.TEST_NUM).to.equal(1337);
    });
});