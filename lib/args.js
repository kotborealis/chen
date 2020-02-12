const deepFreeze = require('deep-freeze');

module.exports = (args = process.argv.slice(2)) => {
    let state_all_unnamed = false;
    return deepFreeze(args
        .map(safeSplitEq)
        .flat()
        .map(removeQuotationMarks)
        .reduce((obj, current, i, argv) => {
            const next = argv[i + 1] || null;
            const prev = argv[i - 1] || null;

            if(state_all_unnamed){
                obj._.push(token_to_value(current));
                return obj;
            }

            if(current === '--'){
                state_all_unnamed = true;
                return obj;
            }

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
};

const valid = token => !!token;
const isParam = token => token && token.length >= 3 && token.indexOf('--') === 0;
const isFlags = token => token && !isParam(token) && token.length >= 2 && token.indexOf('-') === 0;
const getParam = token => isParam(token) ? token.slice(2) : null;
const getFlags = token => isFlags(token) ? token.slice(1).split('') : null;

const safeSplitEq = str => {
    if(!isParam(str)) return [str];

    const indexOfEq = str.indexOf('=');
    if(indexOfEq < 1) return [str];

    return [
        str.slice(0, indexOfEq),
        str.slice(indexOfEq + 1),
    ].filter(_ => _);
};

const removeQuotationMarks = str => {
    if(
        (str[0] === '"' && str[str.length - 1] === '"') ||
        (str[0] === "'" && str[str.length - 1] === "'")
    )
        return str.slice(1, -1);
    return str;
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
