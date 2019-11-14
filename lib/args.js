const deepFreeze = require('deep-freeze');

module.exports = (args = process.argv.slice(2)) =>
    deepFreeze(args
        .map(safeSplitEq)
        .reduce((a, b) => a.concat(b), [])
        .reduce((obj, current, i, argv) => {
            const next = argv[i + 1] || null;
            const prev = argv[i - 1] || null;

            // ---_
            // -_
            if(
                (isParam(current) && getParam(current) === '_') ||
                (isFlags(current) && getFlags(current).indexOf('_') >= 0)
            ){
                throw new Error("`_` is reserved for internal usage");
            }

            // --param value
            if(isParam(current) && !isParam(next) && !isFlags(next) && valid(next)){
                const param = getParam(current);
                const val = token_to_value(next);

                if(obj.hasOwnProperty(param)){
                    if(!Array.isArray(obj[param]))
                        obj[param] = [obj[param]];

                    obj[param].push(val);
                }
                else{
                    obj[getParam(current)] = val;
                }
            }
            // --param
            else if(isParam(current)){
                const param = getParam(current);
                obj[param] = true;
            }
            // -abc
            else if(isFlags(current)){
                getFlags(current).forEach(flag => obj[flag] = true);
            }
            // abc
            else if(!isParam(prev)){
                obj._.push(token_to_value(current));
            }

            return obj;
        }, {_: []}));

const valid = token => !!token;
const isParam = token => token && token.length >= 3 && token.indexOf('--') === 0;
const isFlags = token => token && !isParam(token) && token.length >= 2 && token.indexOf('-') === 0;
const getParam = token => isParam(token) ? token.slice(2) : null;
const getFlags = token => isFlags(token) ? token.slice(1).split('') : null;

const safeSplitEq = str => {
    let max_split_at = str.length;

    for(let i = 0; i < str.length; i++){
        const char = str[i];

        if(char === '\\'){
            i++;
            continue;
        }

        if(char === '"'){
            max_split_at = i;
            break;
        }
    }

    const indexOfEq = str.indexOf('=');

    if(indexOfEq < 1) return [str];

    const left = str.slice(0, max_split_at);
    const right = str.slice(max_split_at);
    return [
        left.slice(0, indexOfEq),
        left.slice(indexOfEq+1),
        right
    ].filter(_ => _);
};

const token_to_value = (token) => {
    try{
        const value = JSON.parse(token);
        if(typeof value === 'number')
            return value;
        else
            return token;
    }
    catch(e){
        return token;
    }
};
