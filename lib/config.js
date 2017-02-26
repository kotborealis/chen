const args_parser = require('./args');
const path = require('path');

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

const safeRequire = (name, forceReload = false) => {
    try{
        if(forceReload){
            delete require.cache[require.resolve(name)];
        }
        return require(name)
    }
    catch(e){
        return {};
    }
};

module.exports = {
    load: (args = args_parser()) => {
    	config_loaded = true;
        const config_file =  path.join(process.cwd(), (args.config) || './config/default');
        config_object = Object.assign(
            {},
            safeRequire(path.join(process.cwd(), './config/default'), true),
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
    },
    get: (prop) => {
    	if(!config_loaded){
    		module.exports.load();
    	}
    	objectGet(config_object, prop)
    },
    resolve: () => {
    	if(!config_loaded){
    		module.exports.load();
    	}
    	Object.assign({}, config_object)
    }
};
