require('dotenv').config();
const json_parse = require('./json_parse');

module.exports = (env) => {
    if(!env){
        env = process.env;
    }
    else{
        env = Object.assign({}, env, process.env);
    }

    return Object.keys(env).reduce((env_parsed, key) => {
        env_parsed[key] = json_parse(env[key]);
        return env_parsed;
    }, {});
};