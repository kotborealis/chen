module.exports = (args = process.argv.slice(2)) =>
    args.reduce((obj, current, i, argv) => {
        const next = argv[i + 1] || null;
        const prev = argv[i - 1] || null;

        if(isParam(current) && !isParam(next) && !isFlags(next)){
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

const json_parse = _ => {
    try{
        return JSON.parse(_);
    }
    catch(e){
        return _;
    }
};

const isParam = _ => _ && _.length >= 3 && _.indexOf('--') === 0;
const isFlags = _ => _ && !isParam(_) && _.length >= 2 && _.indexOf('-') === 0;
const getParam = _ => isParam(_) ? _.slice(2) : null;
const getFlags = _ => isFlags(_) ? _.slice(1).split('') : [];