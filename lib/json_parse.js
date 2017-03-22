const json_parse = _ => {
    try{
        return JSON.parse(_);
    }
    catch(e){
        return _;
    }
};

module.exports = json_parse;