const path = require('path');
const args_parser = require('./args');
const deepExtend = require('deep-extend');
const deepFreeze = require('deep-freeze');

/**
 *
 * @param defaultConfig File with default config, default config object, or array of any of those
 * @param args Used for testing; Arguments object from chen.args
 */
module.exports = (defaultConfig = '.config.js', args = args_parser()) =>
    deepFreeze({
        ...deepExtend(...
            [
                ...(Array.isArray(defaultConfig) ? defaultConfig : [defaultConfig]),
                ...(Array.isArray(args.config) ? args.config : [args.config])
            ].map(config => typeof config === 'string'
                ? require(path.resolve(process.cwd(), config))
                : {...config}
            )
        )
    });