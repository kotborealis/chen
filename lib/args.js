const json_parse = require('./json_parse');

module.exports = (args = process.argv.slice(2)) =>
    args
        .map(safeSplitEq)
        .reduce((a, b) => a.concat(b), [])
        .reduce((obj, current, i, argv) => {
            const next = argv[i + 1] || null;
            const prev = argv[i - 1] || null;

            if(isParam(current) && !isParam(next) && !isFlags(next) && valid(next)){
                obj[getParam(current)] = json_parse(next);
            }
            else if(isParam(current)){
                obj[getParam(current)] = true;
            }
            else if(isFlags(current)){
                getFlags(current).forEach(flag => obj[flag] = true);
            }
            else if(!isParam(prev)){
                obj._.push(json_parse(current));
            }
            return obj;
    }, {_: []});

const valid = _ => !!_;
const isParam = _ => _ && _.length >= 3 && _.indexOf('--') === 0;
const isFlags = _ => _ && !isParam(_) && _.length >= 2 && _.indexOf('-') === 0;
const getParam = _ => isParam(_) ? _.slice(2) : null;
const getFlags = _ => isFlags(_) ? _.slice(1).split('') : [];

const safeSplitEq = str => {
    let max_split_at = str.length;

    for(let i = 0; i < str.length; i++){
        const char = str[i];
        const next = str[i+1] || '';

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