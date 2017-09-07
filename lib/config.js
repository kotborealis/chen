const args_parser = require('./args');
const path = require('path');
const deepextend = require('deep-extend');

const default_config_path = './config/default';
let config_loaded = false;
let config_object = {};

const objectGet = (obj, prop, delimiter = '.') => {
    if(!obj){
        return null;
    }

    if(!prop){
        return obj;
    }

    if(prop.indexOf(delimiter) < 0){
        return obj[prop];
    }

    let value = obj;
    for(let i of prop.split(delimiter)){
        if(value.hasOwnProperty(i)){
            value = value[i];
        }
        else{
            return null;
        }
    }

    return value;
};

const safeRequire = (name, forceReload = false, silent = false) => {
    try{
        if(forceReload){
            delete require.cache[require.resolve(name)];
        }
        return require(name)
    }
    catch(e){
        if(!silent){
            console.log("chen.js: could not load file", name, e);
        }
        return {};
    }
};

const objectSet = (obj, prop, set_value, delimiter = '.') => {
    if(!obj || !prop){
        return;
    }

    if(prop.indexOf(delimiter) < 0){
        return obj[prop] = set_value;
    }

    let value = obj;
    for(let i of prop.split(delimiter).slice(0, -1)){
        if(!value.hasOwnProperty(i)){
            value[i] = {};
        }
        value = value[i];
    }

    return value[prop.split(delimiter).pop()] = set_value;
};

const props = {
    load: (args = args_parser(), config_path = false) => {
        config_object = {};

        const config_file =  path.join(process.cwd(), args.config || (config_path || default_config_path));
        config_object = deepextend(
            {},
            safeRequire(path.join(process.cwd(), config_path || default_config_path), true, true),
            safeRequire(config_file, true)
        );
        for(let i in args){

            if(i === 'config') continue;
            if(i.indexOf('config.') === 0){
                objectSet(config_object, i.slice('config.'.length), args[i]);
            }
            else{
                objectSet(config_object, `args.${i}`, args[i]);
            }
        }
        config_loaded = true;
    },

    _load: (config_path) => props.load(undefined, config_path),

    get: (prop) => {
    	if(!config_loaded){
    		module.exports.load();
    	}
    	return objectGet(config_object, prop)
    },

    resolve: () => {
    	if(!config_loaded){
    		module.exports.load();
    	}
    	return Object.assign({}, config_object)
    }
};

module.exports = new Proxy(props._load, {
    get: (target, prop) => props[prop],
    set: () => undefined
});