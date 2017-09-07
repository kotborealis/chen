const expect = require('chai').expect;

const args_parser = require('../lib/args');
const config = require('../lib/config');

describe('config loader', () => {
    it('should load default config', () => {
        config.load(args_parser(['--config', 'wrong_door_buddy.js']));
        expect(config.resolve().module_a.val_b).eql(2);
    });

    it('should override default config', () => {
        config.load(args_parser(['--config', './config/example.js']));
        expect(config.resolve().module_a.val_b).eql('override');
    });

    it('should put args to config.args', () => {
        config.load(args_parser(['--config', './config/example.js', '-a']));
        expect(config.resolve().args).eql({_: [], a: true});
    });

    it('should override config with --config.[smth] args', () => {
        config.load(args_parser(['--config', './config/example.js', '--config.module_a.faf.fof', '2']));
        expect(config.resolve().module_a.faf.fof).eql(2);
    });

    it('resolve() should not allow to mutate config object', () => {
        config.load();
        config.resolve().test = 'test';
        expect(config.resolve().test).eql(undefined);
    });

    it('get should be null-safe', () => {
        config.load();
        expect(config.get('totally.non.existing.prop')).to.eql(null);
    });

    it('should work just fine with functions', () => {
        config.load();
        expect((config.get('chat.api'))()).to.eql(1);
    });

    it('should load specified config', () => {
        config('config/.test_config');
        expect(config.get('ass_we_can')).to.eql("Wrestling");
    });

    it('should load specified default config', () => {
        config('config/.test_config', 'config/.test_config_default');
        expect(config.get('ass_we_can')).to.eql("Wrestling");
        expect(config.get('faf')).to.eql("fof");
    });

    it('should work w/ multiple default configs', () => {
        config('config/.test_config', ['config/.test_config_default', 'config/.test_config_default2']);
        expect(config.get('ass_we_can')).to.eql("Wrestling");
        expect(config.get('faf')).to.eql("fof");
        expect(config.get('fof')).to.eql("faf");
    });
});