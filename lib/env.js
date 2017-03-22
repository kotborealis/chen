const json_parse = require('./json_parse');

module.exports = (env = process.env) => 
    Object.keys(env).reduce((env_parsed, key) => {
        env_parsed[key] = json_parse(env[key]);
        return env_parsed;
    }, {});